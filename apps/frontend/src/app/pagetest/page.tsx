'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Application, Container, Graphics, Sprite, Texture, Text, TextStyle } from 'pixi.js';

// ===== Types =====

interface ParticleParams {
  gap: number;
  scale: number;
  stiffness: number;
  damping: number;
  jitter: number;
  size: number;
  repel: number;
  radius: number;
  float: number;
}

const DEFAULT_PARAMS: ParticleParams = {
  gap: 2,
  scale: 2.5,
  stiffness: 0.001,
  damping: 0.001,
  jitter: 0,
  size: 2,
  repel: 1,
  radius: 30,
  float: 0.03,
};

interface Particle {
  sprite: Sprite;
  origX: number;
  origY: number;
  homeX: number;
  homeY: number;
}

// ===== Slider definitions =====

interface SliderDef {
  key: keyof ParticleParams;
  label: string;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
}

const SLIDERS: SliderDef[] = [
  { key: 'gap', label: 'Gap', min: 1, max: 20, step: 1 },
  { key: 'scale', label: 'Scale', min: 0.1, max: 5, step: 0.1, format: (v) => v.toFixed(1) },
  { key: 'size', label: 'Size', min: 0.5, max: 20, step: 0.5, format: (v) => v.toFixed(1) },
  { key: 'radius', label: 'Radius', min: 10, max: 300, step: 5 },
  { key: 'float', label: 'Float', min: 0, max: 0.5, step: 0.01, format: (v) => v.toFixed(2) },
];

// ===== Particle System =====

class ParticleSystem {
  private app: Application | null = null;
  private container: Container | null = null;
  private particles: Particle[] = [];
  params: ParticleParams;
  private whiteTexture: Texture | null = null;
  private mouseX = -9999;
  private mouseY = -9999;
  private mouseOnCanvas = false;
  private imgWidth = 0;
  private imgHeight = 0;
  private centerX = 0;
  private centerY = 0;
  private needsResample = false;
  private isResampling = false;
  private currentFloat = 0;
  private smoothMX = 0;
  private smoothMY = 0;
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    this.params = { ...DEFAULT_PARAMS };
  }

  async init(hostElement: HTMLElement): Promise<void> {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.app = new Application();
    await this.app.init({
      width: hostElement.clientWidth * dpr,
      height: hostElement.clientHeight * dpr,
      backgroundAlpha: 0,
      antialias: true,
      resolution: dpr,
      autoDensity: false,
    });

    hostElement.appendChild(this.app.canvas as HTMLCanvasElement);

    const canvas = this.app.canvas as HTMLCanvasElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    this.container = new Container();
    this.app.stage.addChild(this.container);

    const g = new Graphics();
    g.circle(0, 0, 1);
    g.fill({ color: 0xffffff });
    this.whiteTexture = this.app.renderer.generateTexture(g);
    g.destroy();

    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerleave', this.onPointerLeave);

    this.app.ticker.add(this.tick);

    this.resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0 && this.app) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.app.renderer.resize(width * dpr, height * dpr);
        this.app.renderer.resolution = dpr;
        this.centerComposition();
      }
    });
    this.resizeObserver.observe(hostElement);

    await this.resampleParticles('/picture/lm.png');
  }

  setParam(key: keyof ParticleParams, value: number): void {
    const old = this.params[key];
    (this.params as unknown as Record<string, number>)[key] = value;

    if (key === 'gap' && value !== old) this.needsResample = true;
    if (key === 'scale' && value !== old) {
      this.recalcHomePositions();
      this.centerComposition();
    }
    if (key === 'size' && value !== old) {
      for (const p of this.particles) p.sprite.scale.set(value);
    }
  }

  private async resampleParticles(imageUrl: string): Promise<void> {
    if (!this.container || !this.app || !this.whiteTexture) return;

    for (const p of this.particles) p.sprite.destroy();
    this.particles = [];
    this.container.removeChildren();

    const img = await this.loadImage(imageUrl);
    this.imgWidth = img.naturalWidth;
    this.imgHeight = img.naturalHeight;

    const MAX_DIM = 300;
    let sw = this.imgWidth;
    let sh = this.imgHeight;
    if (sw > MAX_DIM || sh > MAX_DIM) {
      const ratio = Math.min(MAX_DIM / sw, MAX_DIM / sh);
      sw = Math.floor(sw * ratio);
      sh = Math.floor(sh * ratio);
    }

    const offscreen = document.createElement('canvas');
    offscreen.width = sw;
    offscreen.height = sh;
    const ctx = offscreen.getContext('2d')!;
    ctx.drawImage(img, 0, 0, sw, sh);
    const imageData = ctx.getImageData(0, 0, sw, sh);
    const pixels = imageData.data;

    const { gap, scale, size } = this.params;
    const halfW = sw / 2;
    const halfH = sh / 2;

    for (let y = 0; y < sh; y += gap) {
      for (let x = 0; x < sw; x += gap) {
        const idx = (y * sw + x) * 4;
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];
        const a = pixels[idx + 3];
        if (a < 10) continue;

        const sprite = new Sprite(this.whiteTexture);
        sprite.tint = (r << 16) | (g << 8) | b;
        sprite.alpha = a / 255;
        sprite.anchor.set(0.5);
        sprite.scale.set(size);

        const homeX = (x - halfW) * scale;
        const homeY = (y - halfH) * scale;
        sprite.x = homeX;
        sprite.y = homeY;

        this.container.addChild(sprite);
        this.particles.push({ sprite, origX: x, origY: y, homeX, homeY });
      }
    }
    this.centerComposition();
  }

  private recalcHomePositions(): void {
    const { scale } = this.params;
    const MAX_DIM = 300;
    let sw = this.imgWidth;
    let sh = this.imgHeight;
    if (sw > MAX_DIM || sh > MAX_DIM) {
      const ratio = Math.min(MAX_DIM / sw, MAX_DIM / sh);
      sw = Math.floor(sw * ratio);
      sh = Math.floor(sh * ratio);
    }
    const halfW = sw / 2;
    const halfH = sh / 2;
    for (const p of this.particles) {
      p.homeX = (p.origX - halfW) * scale;
      p.homeY = (p.origY - halfH) * scale;
    }
  }

  private centerComposition(): void {
    if (!this.container || !this.app) return;
    this.centerX = this.app.screen.width / 2;
    this.centerY = this.app.screen.height / 2;
    this.container.x = this.centerX;
    this.container.y = this.centerY;
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load: ${url}`));
      img.src = url;
    });
  }

  private onPointerMove = (e: PointerEvent): void => {
    const canvas = this.app?.canvas as HTMLCanvasElement | undefined;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.mouseX = (e.clientX - rect.left) * dpr;
    this.mouseY = (e.clientY - rect.top) * dpr;
    this.mouseOnCanvas = true;
  };

  private onPointerLeave = (): void => {
    this.mouseOnCanvas = false;
  };

  private tick = (): void => {
    if (this.needsResample && !this.isResampling) {
      this.needsResample = false;
      this.isResampling = true;
      this.resampleParticles('/picture/lm.png').finally(() => {
        this.isResampling = false;
      });
      return;
    }
    if (this.isResampling || !this.container) return;

    const { stiffness, damping, jitter, repel, radius } = this.params;
    const thicknessSq = radius * radius;

    let localMouseX = 0,
      localMouseY = 0;
    if (this.mouseOnCanvas) {
      const local = this.container.toLocal({ x: this.mouseX, y: this.mouseY });
      localMouseX = local.x;
      localMouseY = local.y;
    }

    for (const p of this.particles) {
      const easeSpeed = 1 / 30;
      let vx = (p.homeX - p.sprite.x) * easeSpeed;
      let vy = (p.homeY - p.sprite.y) * easeSpeed;

      if (this.mouseOnCanvas) {
        const dx = p.sprite.x - localMouseX;
        const dy = p.sprite.y - localMouseY;
        const distSq = dx * dx + dy * dy;

        if (distSq > 0.01) {
          let f = thicknessSq / distSq;
          f = f < 0.1 ? 0.1 : f;
          f = f > 7 ? 7 : f;

          const angle = Math.atan2(dy, dx);
          vx += f * Math.cos(angle) * repel;
          vy += f * Math.sin(angle) * repel;
        }
      }

      vx += (p.homeX - p.sprite.x) * stiffness;
      vy += (p.homeY - p.sprite.y) * stiffness;

      vx *= 1 - damping;
      vy *= 1 - damping;

      vx += (Math.random() - 0.5) * jitter * 2;
      vy += (Math.random() - 0.5) * jitter * 2;

      p.sprite.x += vx;
      p.sprite.y += vy;
    }

    // 整体漂浮（平滑鼠标位置，避免跳变）
    {
      this.smoothMX += (this.mouseX - this.smoothMX) * 0.5;
      this.smoothMY += (this.mouseY - this.smoothMY) * 0.5;
      const targetFloat = this.mouseOnCanvas ? this.params.float : 0;
      this.currentFloat += (targetFloat - this.currentFloat) * 0.04;
      const targetX = this.centerX + (this.smoothMX - this.centerX) * this.currentFloat;
      const targetY = this.centerY + (this.smoothMY - this.centerY) * this.currentFloat;
      this.container.x += (targetX - this.container.x) * 0.03;
      this.container.y += (targetY - this.container.y) * 0.03;
    }
  };

  destroy(): void {
    if (this.app) {
      this.app.ticker.remove(this.tick);
      window.removeEventListener('pointermove', this.onPointerMove);
      window.removeEventListener('pointerleave', this.onPointerLeave);
      for (const p of this.particles) p.sprite.destroy();
      this.particles = [];
      this.whiteTexture?.destroy();
      this.whiteTexture = null;
      this.app.destroy(true);
      this.app = null;
      this.container = null;
    }
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }
}

// ===== Dot Matrix Background (PixiJS) =====

interface CellText {
  text: Text;
  r: number;
  c: number;
  cx: number;
  cy: number;
}

class DotMatrix {
  private app: Application | null = null;
  private cells: CellText[] = [];
  private grid: number[][] = [];
  private cellSize = 100;
  private mouseX = -999;
  private mouseY = -999;
  private prevMX = -999;
  private prevMY = -999;
  private mouseOn = false;
  private lastFlip = 0;
  private ro: ResizeObserver | null = null;
  readonly radius = 250;

  constructor(host: HTMLElement) {
    this.setup(host);
  }

  private async setup(host: HTMLElement) {
    this.app = new Application();
    await this.app.init({
      resizeTo: host,
      backgroundAlpha: 0,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
    });

    const canvas = this.app.canvas as HTMLCanvasElement;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    host.appendChild(canvas);

    const w = host.clientWidth;
    const h = host.clientHeight;
    this.buildGrid(w, h);
    this.app.ticker.add(this.tick);

    window.addEventListener('pointermove', this.onMove);
    window.addEventListener('pointerleave', this.onLeave);

    this.ro = new ResizeObserver(() => {
      const rw = host.clientWidth;
      const rh = host.clientHeight;
      if (rw > 0 && rh > 0) {
        this.rebuildGrid(rw, rh);
      }
    });
    this.ro.observe(host);
  }

  private buildGrid(w: number, h: number) {
    const cols = Math.ceil(w / this.cellSize);
    const rows = Math.ceil(h / this.cellSize);
    this.grid = [];
    this.cells = [];

    const style = new TextStyle({
      fontFamily: '"Courier New", monospace',
      fontSize: 20,
      fontWeight: 'bold',
      fill: '#ffffff',
    });

    for (let r = 0; r < rows; r++) {
      this.grid[r] = [];
      for (let c = 0; c < cols; c++) {
        this.grid[r][c] = Math.random() > 0.5 ? 1 : 0;
        const cx = c * this.cellSize + this.cellSize / 2;
        const cy = r * this.cellSize + this.cellSize / 2;
        const text = new Text({ text: String(this.grid[r][c]), style });
        text.anchor.set(0.5);
        text.x = cx;
        text.y = cy;
        text.alpha = 0;
        this.app!.stage.addChild(text);
        this.cells.push({ text, r, c, cx, cy });
      }
    }
  }

  private rebuildGrid(w: number, h: number) {
    if (!this.app) return;
    for (const cell of this.cells) cell.text.destroy();
    this.cells = [];
    this.app.stage.removeChildren();
    this.buildGrid(w, h);
  }

  private onMove = (e: PointerEvent) => {
    const canvas = this.app?.canvas as HTMLCanvasElement | undefined;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
    this.mouseOn = true;
  };

  private onLeave = () => {
    this.mouseOn = false;
  };

  private tick = () => {
    if (!this.app) return;
    const mouseMoved = this.mouseX !== this.prevMX || this.mouseY !== this.prevMY;
    const now = Date.now();
    const canFlip = mouseMoved && now - this.lastFlip > 300;

    const radSq = this.radius * this.radius;
    const mx = this.mouseX;
    const my = this.mouseY;

    for (const cell of this.cells) {
      const dx = cell.cx - mx;
      const dy = cell.cy - my;
      const inRange = this.mouseOn && dx * dx + dy * dy < radSq;

      if (inRange) {
        if (canFlip) {
          this.grid[cell.r][cell.c] = this.grid[cell.r][cell.c] === 0 ? 1 : 0;
          cell.text.text = String(this.grid[cell.r][cell.c]);
        }
        const dist = Math.sqrt(dx * dx + dy * dy);
        const targetAlpha = Math.max(0, 1 - dist / this.radius);
        cell.text.alpha += (targetAlpha - cell.text.alpha) * 0.12;
        const val = this.grid[cell.r][cell.c];
        cell.text.tint = val === 0 ? 0x00ff00 : 0x00d4ff;
      } else {
        cell.text.alpha += (0 - cell.text.alpha) * 0.04;
      }
    }

    if (canFlip) this.lastFlip = now;
    this.prevMX = this.mouseX;
    this.prevMY = this.mouseY;
  };

  destroy() {
    if (this.app) {
      this.app.ticker.remove(this.tick);
      for (const cell of this.cells) cell.text.destroy();
      this.cells = [];
      this.app.destroy(true);
      this.app = null;
    }
    this.ro?.disconnect();
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerleave', this.onLeave);
  }
}

// ===== Page Component =====

export default function TestPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const psRef = useRef<ParticleSystem | null>(null);
  const dotRef = useRef<DotMatrix | null>(null);
  const [params, setParams] = useState<ParticleParams>({ ...DEFAULT_PARAMS });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [showBorder, setShowBorder] = useState(true);
  const [boxW, setBoxW] = useState(500);
  const [boxH, setBoxH] = useState(550);
  const [sizeUnit, setSizeUnit] = useState<'px' | '%'>('px');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let destroyed = false;
    const ps = new ParticleSystem();
    psRef.current = ps;

    ps.init(container)
      .then(() => {
        if (!destroyed) {
          setParams({ ...ps.params });
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!destroyed) {
          setError(err instanceof Error ? err.message : 'Failed to init');
          setLoading(false);
        }
      });

    return () => {
      destroyed = true;
      ps.destroy();
      psRef.current = null;
    };
  }, []);

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;
    const dot = new DotMatrix(bg);
    dotRef.current = dot;
    return () => {
      dot.destroy();
      dotRef.current = null;
    };
  }, []);

  const handleParamChange = useCallback((key: keyof ParticleParams, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
    psRef.current?.setParam(key, value);
  }, []);

  // 最外层：全屏黑色背景，承载点阵 canvas + 粒子 canvas + 控制面板
  return (
    <div
      ref={bgRef}
      className="h-screen w-screen flex items-center justify-center bg-black relative"
    >
      {/* 粒子画布层：可调尺寸，z-10 */}
      <div className="w-full h-screen flex items-center justify-center">
        <div className="">
          <div className="text-[#00d4ff] text-[clamp(16px,4.8vw,24px)]">
            <span>WEB DEVELOPOMENT CLUB</span>
          </div>
          <div className="text-[#d9d9d98f] text-[10px]">
            <span>DIGITAL PRODUCTS · INTELLIGENT SYSTEMS · USER-CENTRIC DESIGN</span>
          </div>
          <div className="leading-none text-[#ffffff] text-[clamp(3rem,5vw+5rem,10rem)]">
            <span>STUDIO</span>
          </div>
          <div className="leading-none text-[#00d4ff] text-[clamp(3rem,5vw+5rem,10rem)]">
            <span>LANSHAN</span>
          </div>
        </div>
        <div
          className={`relative rounded-lg overflow-hidden shadow-2xl z-10 ${showBorder ? 'border border-white/10' : ''}`}
          style={{
            width: sizeUnit === 'px' ? boxW : `${boxW}%`,
            height: sizeUnit === 'px' ? boxH : `${boxH}%`,
          }}
        >
          <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden"
            style={{ background: 'transparent' }}
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm">
                Loading particles...
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 控制面板开关按钮 */}
      <button
        onClick={() => setPanelOpen((v) => !v)}
        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/70 border border-white/10 text-white/60 hover:text-white text-sm flex items-center justify-center"
      >
        {panelOpen ? '×' : '☰'}
      </button>

      {/* 控制面板：右上角毛玻璃滑块面板，z-10 */}
      {panelOpen && (
        <div className="absolute top-12 right-4 z-10 bg-black/70 backdrop-blur-md rounded-lg border border-white/10 p-4 w-64 text-white text-sm">
          <h3 className="text-base font-semibold mb-3 text-white/80 select-none">粒子参数</h3>
          {SLIDERS.map(({ key, label, min, max, step, format }) => (
            <div key={key} className="mb-3">
              <div className="flex justify-between mb-1">
                <label className="text-white/60 text-xs select-none">{label}</label>
                <span className="text-white/40 text-xs font-mono select-none">
                  {format ? format(params[key]) : String(params[key])}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={params[key]}
                onChange={(e) => handleParamChange(key, parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer
                         bg-white/20
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:w-3.5
                         [&::-webkit-slider-thumb]:h-3.5
                         [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:bg-white
                         [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          ))}
          <hr className="border-white/10 my-3" />
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-white/80 select-none">容器尺寸</h3>
            <div className="flex gap-1">
              <button
                onClick={() => setShowBorder((v) => !v)}
                className={`px-2 py-0.5 rounded text-xs ${showBorder ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40'}`}
              >
                边框
              </button>
              <button
                onClick={() => setSizeUnit('px')}
                className={`px-2 py-0.5 rounded text-xs ${sizeUnit === 'px' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40'}`}
              >
                px
              </button>
              <button
                onClick={() => setSizeUnit('%')}
                className={`px-2 py-0.5 rounded text-xs ${sizeUnit === '%' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40'}`}
              >
                %
              </button>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <label className="text-white/60 text-xs select-none">Width</label>
              <span className="text-white/40 text-xs font-mono select-none">
                {boxW}
                {sizeUnit === 'px' ? 'px' : '%'}
              </span>
            </div>
            <input
              type="range"
              min={sizeUnit === 'px' ? 200 : 20}
              max={sizeUnit === 'px' ? 1400 : 100}
              step={sizeUnit === 'px' ? 10 : 1}
              value={boxW}
              onChange={(e) => setBoxW(parseInt(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/20
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5
                       [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <label className="text-white/60 text-xs select-none">Height</label>
              <span className="text-white/40 text-xs font-mono select-none">
                {boxH}
                {sizeUnit === 'px' ? 'px' : '%'}
              </span>
            </div>
            <input
              type="range"
              min={sizeUnit === 'px' ? 150 : 20}
              max={sizeUnit === 'px' ? 900 : 100}
              step={sizeUnit === 'px' ? 10 : 1}
              value={boxH}
              onChange={(e) => setBoxH(parseInt(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/20
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5
                       [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* 底部倒三角指示器：上下循环浮动 0.5rem */}
      <style>{`@keyframes drift{0%,100%{transform:translate(-50%,0)}50%{transform:translate(-50%,-0.5rem)}}`}</style>
      <svg
        className="absolute bottom-8 left-1/2 z-20 pointer-events-none"
        style={{ animation: 'drift 1.5s ease-in-out infinite' }}
        width="24"
        height="16"
        viewBox="0 0 24 16"
      >
        <polygon points="12,16 0,0 24,0" fill="white" />
      </svg>
    </div>
  );
}
