'use client';
import { useRouter } from 'next/navigation';
import { useTransitionStore } from '@/store/transitionStore';

export const ScrollIndicator = () => {
  const router = useRouter();
  const navigate = useTransitionStore((s) => s.navigate);

  return (
    <>
      <style>{`
        @keyframes driftLeft {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-0.5rem); }
        }
        @keyframes driftRight {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(0.5rem); }
        }
      `}</style>
      <div
        className="pointer-events-none 
      absolute bottom-[2rem] left-1/2 -translate-x-1/2 
      z-20 flex items-center gap-3"
      >
        {/* 左三角 */}
        <svg
          style={{ animation: 'driftLeft 1.5s ease-in-out infinite' }}
          className="max-[500px]:w-3  max-[500px]:h-3
          sm:w-4 sm:h-4 max-lg:w-5 max-lg:h-5"
          viewBox="0 0 20 20"
        >
          <polygon points="16,10 0,2 0,18" fill="white" />
        </svg>
        {/* 中间文字 */}
        <span
          onClick={() => navigate('/content', router.push)}
          className="font-bold text-white tracking-wider max-lg:text-[2rem]
          max-[500px]:text-[1rem]
        select-none pointer-events-auto cursor-pointer
        hover:opacity-80 transition-opacity duration-300 ease-in-out"
        >
          LEARN MORE
        </span>
        {/* 右三角 */}
        <svg
          style={{ animation: 'driftRight 1.5s ease-in-out infinite' }}
          className="
          max-[500px]:w-3  max-[500px]:h-3
          sm:w-4 sm:h-4 max-lg:w-5 max-lg:h-5"
          viewBox="0 0 20 20"
        >
          <polygon points="4,10 20,2 20,18" fill="white" />
        </svg>
      </div>
    </>
  );
};
