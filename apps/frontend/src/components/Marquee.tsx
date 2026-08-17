'use client';
import { useEffect, useRef } from 'react';
import { useMarqueeStore } from '@/lib/MarqueeStore';

interface MarqueeProps {
  text: string;
  bgColor: string;
  textColor: string;
  direction?: 'left' | 'right';
}

export const Marquee = ({ text, bgColor, textColor, direction = 'left' }: MarqueeProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  // 物理量
  const posRef = useRef(0); // 当前位移（px）
  const speedRef = useRef(0); // 当前实际速度
  const targetSpeedRef = useRef(0); // 目标速度

  const isReversed = useMarqueeStore((state) => state.isReversed);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

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
  }, []);

  useEffect(() => {
    const base = 1;
    const defaultSpeed = direction === 'left' ? -base : base;
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
  }, [isReversed, direction]);

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
