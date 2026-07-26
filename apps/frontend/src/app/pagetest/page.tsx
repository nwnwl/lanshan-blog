'use client';
import { useTransition } from './lib/TransitionContext';

export default function TestPage() {
  const { navigate } = useTransition();

  return (
    <div className="h-screen w-screen flex items-center justify-center gap-20 bg-black">
      <span
        onClick={() => navigate('/pagetest/pagetest1')}
        className="text-[3rem] text-white cursor-pointer select-none"
      >
        TEST1
      </span>
      <span
        onClick={() => navigate('/pagetest/pagetest2')}
        className="text-[3rem] text-white cursor-pointer select-none"
      >
        TEST2
      </span>
    </div>
  );
}
