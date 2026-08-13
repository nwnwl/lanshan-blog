'use client';

import { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
  baseOpacity: number;
  speed: number;
  spawnTime: number;
  lifetime: number;
}

const STEP = 1 / 60;

const PARAMS = {
  intervalBase: 0.32,
  intervalRandom: 0.48,
  opacityMin: 0.85,
  opacityMax: 1.0,
  speedMin: 8,
  speedMax: 26,
  sizeBase: 0.6,
  aboveBias: 0.7,
  fadeDuration: 2,
};

export const LightDotsCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const lineYRef = useRef(0);
  const rafRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const widthRef = useRef(0);
  const heightRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const w = window.innerWidth;
      const sectionEl = canvas.closest('section');
      const h = sectionEl?.clientHeight ?? window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      widthRef.current = w;
      heightRef.current = h;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lineYRef.current = h - w * 0.067;
    };

    resize(); // 首载立即设置画布尺寸
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(resize, 150); // 防抖：停止拉伸 150ms 后再重置画布尺寸
    };
    window.addEventListener('resize', onResize);

    const spawnDot = () => {
      const w = widthRef.current;
      const lineY = lineYRef.current;

      const offsetY =
        Math.random() < PARAMS.aboveBias ? -(Math.random() * 100) : Math.random() * 100;

      const u = (Math.random() + Math.random()) / 2;
      dotsRef.current.push({
        x: u * w,
        y: lineY + offsetY,
        baseOpacity: PARAMS.opacityMin + Math.random() * (PARAMS.opacityMax - PARAMS.opacityMin),
        speed: PARAMS.speedMin + Math.random() * (PARAMS.speedMax - PARAMS.speedMin),
        spawnTime: performance.now() / 1000,
        lifetime: 5 + Math.random() * 5,
      });
    };

    const update = (now: number) => {
      const nowSec = now / 1000;
      const w = widthRef.current;
      const h = heightRef.current;

      ctx.clearRect(0, 0, w, h);

      if (
        nowSec - spawnTimerRef.current >
        PARAMS.intervalBase + Math.random() * PARAMS.intervalRandom
      ) {
        spawnDot();
        spawnTimerRef.current = nowSec;
      }

      const dots = dotsRef.current;
      for (let i = dots.length - 1; i >= 0; i--) {
        const dot = dots[i];
        dot.y -= dot.speed * STEP;

        const age = nowSec - dot.spawnTime;
        let opacity = dot.baseOpacity;
        if (age > dot.lifetime) {
          opacity = dot.baseOpacity * Math.max(0, 1 - (age - dot.lifetime) / PARAMS.fadeDuration);
        }

        if (opacity <= 0.005 || dot.y < -10) {
          dots.splice(i, 1);
          continue;
        }

        const r = PARAMS.sizeBase + opacity * 1.6;
        const glow = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, r * 2.5);
        glow.addColorStop(0, `rgba(255,255,255,${opacity.toFixed(3)})`);
        glow.addColorStop(0.15, `rgba(220,220,220,${(opacity * 0.6).toFixed(3)})`);
        glow.addColorStop(0.5, `rgba(136,136,136,${(opacity * 0.2).toFixed(3)})`);
        glow.addColorStop(1, 'rgba(136,136,136,0)');

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      clearTimeout(timer);
      dotsRef.current = [];
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" style={{ pointerEvents: 'none' }} />;
};
