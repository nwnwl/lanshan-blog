import { Application, Container, Graphics, Sprite, Texture } from 'pixi.js';

// ===== Types =====

export interface ParticleParams {
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

export const PARTICLE_DEFAULTS: ParticleParams = {
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

export interface ParticleSliderDef {
  key: keyof ParticleParams;
  label: string;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
}

export const PARTICLE_SLIDERS: ParticleSliderDef[] = [
  { key: 'gap', label: 'Gap', min: 1, max: 20, step: 1 },
  { key: 'scale', label: 'Scale', min: 0.1, max: 5, step: 0.1, format: (v) => v.toFixed(1) },
  { key: 'size', label: 'Size', min: 0.5, max: 20, step: 0.5, format: (v) => v.toFixed(1) },
  { key: 'radius', label: 'Radius', min: 10, max: 300, step: 5 },
  { key: 'float', label: 'Float', min: 0, max: 0.5, step: 0.01, format: (v) => v.toFixed(2) },
];

interface Particle {
  sprite: Sprite;
  origX: number;
  origY: number;
  homeX: number;
  homeY: number;
}

// ===== Particle System =====

export class ParticleSystem {
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
    this.params = { ...PARTICLE_DEFAULTS };
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

  // ---- 物理帧循环 ----
  // 逆平方排斥力 + 缓动回归 + 弹簧 + 摩擦 + 抖动

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

  // ---- 清理 ----

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
