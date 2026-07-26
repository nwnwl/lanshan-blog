'use client';
import { useTransition } from '../lib/TransitionContext';
import Lottie from 'lottie-react';
import animationData from '../../../../public/lottie/data.json';

export const RouteTransition = () => {
  const { showOverlay } = useTransition();

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#00d4ff]
        transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]
        ${showOverlay ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <Lottie animationData={animationData} loop autoplay />
    </div>
  );
};
