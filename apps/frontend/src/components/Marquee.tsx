'use client';
import { useEffect, useRef, useState } from 'react';
import { useMarqueeStore } from '@/lib/MarqueeStore';

interface MarqueeProps {
  text: string;
  bgColor: string;
  textColor: string;
  direction?: 'left' | 'right';
}

// PC 基准速度 px/s（原 1px/帧在 120Hz 屏约等于此值），改为时间驱动后摆脱刷新率差异
const BASE_SPEED = 120;
// 移动端基准速度（文字更小，降速避免看起来过快）
const BASE_SPEED_MOBILE = 80;
// 速度收敛速率，约等于原 0.15/帧 @60fps
const SMOOTHING = 9;

export const Marquee = ({ text, bgColor, textColor, direction = 'left' }: MarqueeProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  // 物理量
  const posRef = useRef(0); // 当前位移（px）
  const speedRef = useRef(0); // 当前实际速度
  const targetSpeedRef = useRef(0); // 目标速度

  const isReversed = useMarqueeStore((state) => state.isReversed);
  const hasMountedRef = useRef(false);
  const [baseSpeed, setBaseSpeed] = useState(BASE_SPEED);

  // 视口 ≤1024px 用移动端速度
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const update = () => setBaseSpeed(mq.matches ? BASE_SPEED_MOBILE : BASE_SPEED);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // 缓存半宽：每帧读 scrollWidth 会强制回流，是移动端卡顿主因
    let halfWidth = track.scrollWidth / 2;
    const measure = () => {
      halfWidth = track.scrollWidth / 2;
    };
    window.addEventListener('resize', measure);
    // 字体异步加载完成后宽度可能变化，补测一次
    if (document.fonts) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    let rafId: number;
    let lastTime: number | null = null;

    const animate = (time: number) => {
      if (lastTime === null) lastTime = time;
      // 秒，钳制上限防止切后台回来后一次跳一大段
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      // 时间驱动的速度平滑（lerp），刷新率无关
      const diff = targetSpeedRef.current - speedRef.current;
      speedRef.current += diff * (1 - Math.exp(-SMOOTHING * dt));

      posRef.current += speedRef.current * dt;

      // 无缝循环：向左超界拉回，向右超界推回
      if (posRef.current <= -halfWidth) {
        posRef.current += halfWidth;
      } else if (posRef.current >= 0) {
        posRef.current -= halfWidth;
      }

      track.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    const defaultSpeed = direction === 'left' ? -baseSpeed : baseSpeed;
    const target = isReversed ? -defaultSpeed : defaultSpeed;

    if (hasMountedRef.current) {
      // 切换方向瞬间加速 2 倍，300ms 后恢复匀速
      targetSpeedRef.current = target * 2;

      const timeoutId = setTimeout(() => {
        targetSpeedRef.current = target;
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      // 首次 mount，直接匀速
      targetSpeedRef.current = target;
      hasMountedRef.current = true;
    }
  }, [isReversed, direction, baseSpeed]);

  return (
    <div className={`${bgColor} ${textColor} overflow-hidden w-full`}>
      <div
        ref={trackRef}
        className="flex w-full whitespace-nowrap font-medium tracking-widest leading-none"
      >
        <span className="lg:text-8xl text-[5.5rem]">{text}</span>
        <span className="lg:text-8xl text-[5.5rem]">{text}</span>
      </div>
    </div>
  );
};

export default Marquee;
