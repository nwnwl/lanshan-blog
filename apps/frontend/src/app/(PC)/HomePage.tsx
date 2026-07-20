'use client';
import { PC_HeroSection } from './HeroSection';
import { PC_EndSection } from './EndSection';
import { PC_MiddleSection } from './MiddleSection';
import { LaunchAnimation } from '@/components/Launch_animation';
import { useRef } from 'react';

export const PC_HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="contain flex h-screen w-full flex-col overflow-y-auto">
      <LaunchAnimation />
      <PC_HeroSection />
      <PC_MiddleSection />
      <PC_EndSection />
    </div>
  );
};
