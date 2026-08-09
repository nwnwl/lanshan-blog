'use client';

import { useEffect, useRef } from 'react';

interface DotPoint {
  x: number;
  y: number;
  r: number;
}

const SVG_W = 1080;
const SVG_H = 740;
const SPEED = 30;
const WAVE_FACTOR = 0.004;
const HOVER_RADIUS = 30;
const CORNER_LEN = 40;
const CORNER_INSET = 2;
const PADDING = 40;

function parseDots(svgText: string): DotPoint[] {
  const re = /<circle cx="([^"]+)" cy="([^"]+)" r="([^"]+)"/g;
  const dots: DotPoint[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(svgText)) !== null) {
    dots.push({
      x: parseFloat(m[1]),
      y: parseFloat(m[2]),
      r: parseFloat(m[3]),
    });
  }
  return dots;
}

function lerpColor(a: string, b: string, t: number): string {
  const ar = parseInt(a.slice(1, 3), 16);
  const ag = parseInt(a.slice(3, 5), 16);
  const ab = parseInt(a.slice(5, 7), 16);
  const br = parseInt(b.slice(1, 3), 16);
  const bg = parseInt(b.slice(3, 5), 16);
  const bb = parseInt(b.slice(5, 7), 16);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bv = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bv})`;
}

function drawCorners(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const scale = w / SVG_W;
  const L = CORNER_LEN * scale;
  const inset = CORNER_INSET * scale;
  const sw = 2 * scale;

  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = sw;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 左上
  ctx.beginPath();
  ctx.moveTo(L, inset);
  ctx.lineTo(inset, inset);
  ctx.lineTo(inset, L);
  ctx.stroke();

  // 右上
  ctx.beginPath();
  ctx.moveTo(w - L, inset);
  ctx.lineTo(w - inset, inset);
  ctx.lineTo(w - inset, L);
  ctx.stroke();

  // 左下
  ctx.beginPath();
  ctx.moveTo(inset, h - L);
  ctx.lineTo(inset, h - inset);
  ctx.lineTo(L, h - inset);
  ctx.stroke();

  // 右下
  ctx.beginPath();
  ctx.moveTo(w - L, h - inset);
  ctx.lineTo(w - inset, h - inset);
  ctx.lineTo(w - inset, h - L);
  ctx.stroke();
}

export const MountainCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<DotPoint[]>([]);
  const offsetRef = useRef(0);
  const dimsRef = useRef({ w: 0, h: 0, scale: 0 });
  const mouseRef = useRef({ x: -999, y: -999, on: false });

  useEffect(() => {
    fetch('/picture/mountain.svg')
      .then((r) => r.text())
      .then((text) => {
        dotsRef.current = parseDots(text);
      });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = w * (SVG_H / SVG_W);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dimsRef.current = { w, h, scale: w / SVG_W };
    };

    resize();

    const section = document.getElementById('contact');
    if (!section) return;

    let lastTime = 0;

    const draw = () => {
      const { w, h, scale } = dimsRef.current;
      const dots = dotsRef.current;
      const hoverR = HOVER_RADIUS * scale;

      // 白底
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);

      const offset = offsetRef.current;
      const mx = mouseRef.current;
      const mouseOn = mx.on;

      // 山脉点阵（加 PADDING 偏移使其居中留白）
      const padX = PADDING * scale;
      const padY = PADDING * scale;
      const contentW = (SVG_W - PADDING * 2) * scale; // 实际可用宽度

      for (const dot of dots) {
        const phase = dot.x * WAVE_FACTOR;
        const raw = dot.x + offset - phase;
        const wrapW = SVG_W - PADDING * 2;
        const wrappedX = ((raw % wrapW) + wrapW) % wrapW;

        const sx = padX + wrappedX * scale;
        const sy = padY + dot.y * scale;
        const sr = Math.max(dot.r * scale * 0.8, 0.3);

        let color = '#000000';
        if (mouseOn) {
          const dx = sx - mx.x;
          const dy = sy - mx.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < hoverR) {
            color = lerpColor('#000000', '#65E5FF', 1 - dist / hoverR);
          }
        }

        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      // 四角 L 形取景框
      drawCorners(ctx, w, h);
    };

    const raf = { current: null as number | null };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          lastTime = performance.now();
          const loop = (now: number) => {
            const dt = Math.min((now - lastTime) / 1000, 0.1);
            lastTime = now;
            offsetRef.current += SPEED * dt;
            draw();
            raf.current = requestAnimationFrame(loop);
          };
          raf.current = requestAnimationFrame(loop);
        } else {
          if (raf.current !== null) {
            cancelAnimationFrame(raf.current);
            raf.current = null;
          }
        }
      },
      { threshold: 0 },
    );

    observer.observe(section);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        on: true,
      };
    };

    const onLeave = () => {
      mouseRef.current.on = false;
    };

    const onResize = () => resize();

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize);

    return () => {
      observer.disconnect();
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full block cursor-crosshair" />;
};
