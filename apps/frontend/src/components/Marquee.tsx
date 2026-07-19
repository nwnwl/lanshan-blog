'use client';
import { useEffect, useRef } from 'react';
import { useMarqueeStore } from './MarqueeStore';

interface MarqueeProps {
  text: string;
  bgColor: string;
  textColor: string;
  direction?: 'left' | 'right';
}

function Marquee({ text, bgColor, textColor, direction = 'left' }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  // 物理量
  const posRef = useRef(0); // 当前位移（px）
  const speedRef = useRef(0); // 当前实际速度
  const targetSpeedRef = useRef(0); // 目标速度

  const isReversed = useMarqueeStore((state) => state.isReversed);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // 默认速度：direction = left 则向左（负值），right 则向右（正值）
    const base = 0.8; // 匀速速度，单位 px/帧，可调
    const defaultSpeed = direction === 'left' ? -base : base;

    // 根据全局反转状态，决定基础方向
    targetSpeedRef.current = isReversed ? -defaultSpeed : defaultSpeed;

    let rafId: number;
    const animate = () => {
      // 速度平滑过渡（lerp），避免突变造成卡顿感
      const diff = targetSpeedRef.current - speedRef.current;
      speedRef.current += diff * 0.15;

      // 更新位置
      posRef.current += speedRef.current;

      // 获取单份内容宽度（总宽度的一半，因为有两份）
      const halfWidth = track.scrollWidth / 2;

      // 无缝循环：向左超界则拉回来，向右超界则推过去
      if (posRef.current <= -halfWidth) {
        posRef.current += halfWidth;
      } else if (posRef.current >= 0) {
        posRef.current -= halfWidth;
      }

      track.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [direction]);
  // isReversed 变化时，useEffect 会重跑，但这里其实不需要重跑

  useEffect(() => {
    const base = 0.8;
    const defaultSpeed = direction === 'left' ? -base : base;
    targetSpeedRef.current = isReversed ? -defaultSpeed : defaultSpeed;
  }, [isReversed, direction]);

  // 滑动时临时加速
  useEffect(() => {
    const container = document.querySelector('.contain') as HTMLElement;
    if (!container) return;

    const base = 0.8;
    const defaultSpeed = direction === 'left' ? -base : base;

    let timeoutId: ReturnType<typeof setTimeout>;

    const handleWheel = (e: WheelEvent) => {
      const scrollingDown = e.deltaY > 0;

      // 向下滑：反转方向 + 加速
      targetSpeedRef.current = isReversed ? -defaultSpeed * 3 : defaultSpeed * 3;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // 恢复当前状态对应的匀速
        targetSpeedRef.current = isReversed ? -defaultSpeed : defaultSpeed;
      }, 300);
    };

    container.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      clearTimeout(timeoutId);
    };
  }, [direction, isReversed]);

  return (
    <div className={`${bgColor} ${textColor} overflow-hidden w-full`}>
      <div ref={trackRef} className="flex w-fit whitespace-nowrap font-medium tracking-widest">
        <span className="text-6xl md:text-8xl">{text}</span>
        <span className="text-6xl md:text-8xl">{text}</span>
      </div>
    </div>
  );
}

export default Marquee;
