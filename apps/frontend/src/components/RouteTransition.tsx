'use client';
import { useTransitionStore } from '@/store/transitionStore';
import Lottie from 'lottie-react';
import animationData from '../../public/lottie/data.json';

export const RouteTransition = () => {
  const phase = useTransitionStore((s) => s.phase);

  if (phase === 'idle') return null;

  const isIn = phase === 'in';

  return (
    <>
      <div
        className={`fixed inset-0 z-[1000] bg-[#191919]
          ${isIn ? 'anim-loading-in' : 'anim-loading-out'}`}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] flex items-center justify-center pointer-events-none anim-lottie-fade">
        <Lottie animationData={animationData} loop autoplay />
      </div>
    </>
  );
};
