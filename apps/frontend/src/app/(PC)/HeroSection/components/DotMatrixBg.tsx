'use client';

import { useEffect, useRef } from 'react';
import { Application, Text, TextStyle } from 'pixi.js';

interface DotMatrixCell {
  text: Text;
  r: number;
  c: number;
  cx: number;
  cy: number;
}

class DotMatrixEngine {
  private app: Application | null = null;
  private cells: DotMatrixCell[] = [];
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
      if (rw > 0 && rh > 0) this.rebuildGrid(rw, rh);
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
        cell.text.tint = val === 0 ? 0xffffff : 0x00d4ff;
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

// ===== React wrapper =====

export default function DotMatrixBg() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const dot = new DotMatrixEngine(host);
    return () => {
      dot.destroy();
    };
  }, []);

  return <div ref={hostRef} className="absolute inset-0 z-0" />;
}
