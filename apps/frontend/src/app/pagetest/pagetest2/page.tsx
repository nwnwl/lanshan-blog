'use client';
import { useTransition } from '../lib/TransitionContext';
export default function TestPage2() {
  const { navigate } = useTransition();
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black relative">
      <span onClick={() => navigate('/pagetest/pagetest1')} className="text-[3rem] text-white">
        TEST2
      </span>
    </div>
  );
}
