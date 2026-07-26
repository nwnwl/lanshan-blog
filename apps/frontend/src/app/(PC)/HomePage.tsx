'use client';
import { PC_HeroSection } from './HeroSection';
import { LaunchAnimation } from '@/components/Launch_animation';

export const PC_HomePage = () => {
  return (
    <div className="flex h-screen w-full">
      <LaunchAnimation />
      <PC_HeroSection />
    </div>
  );
};
