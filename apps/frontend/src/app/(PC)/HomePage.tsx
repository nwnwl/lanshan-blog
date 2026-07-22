'use client';
import { PC_HeroSection } from './HeroSection';
import { PC_EndSection } from './EndSection';
import { PC_MiddleSection } from './MiddleSection';
import { LaunchAnimation } from '@/components/Launch_animation';
import { useRef, useEffect } from 'react';
import { Marquee } from '@/components/Marquee';
import { useMarqueeStore } from '@/lib/MarqueeStore';

const text_1 = ' // BEYOND LANSHAN · YOUR POTENTIAL AWAITS ';
const text_2 =
  ' \\\\ UI \\\\DESIGN \\\\PRODUCT \\\\OPERATION \\\\SECURITY \\\\FRONTEND \\\\BACKEND ';

export const PC_HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const setReversed = useMarqueeStore((state) => state.setReversed);

  useEffect(() => {
    const container = document.querySelector('.contain') as HTMLElement | null;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const next = e.deltaY > 0;
      if (useMarqueeStore.getState().isReversed !== next) {
        setReversed(next);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: true });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [setReversed]);

  return (
    <div ref={containerRef} className="contain flex h-screen w-full flex-col overflow-y-auto">
      <LaunchAnimation />
      <PC_HeroSection />
      <div className="my-6">
        <Marquee text={text_1} bgColor={'bg-white'} textColor={'text-black'} direction="left" />
        <Marquee text={text_2} bgColor={'bg-white'} textColor={'text-black'} direction="right" />
      </div>
      <PC_MiddleSection />
      <PC_EndSection />
    </div>
  );
};
