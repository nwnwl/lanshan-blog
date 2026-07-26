'use client';
import { useState, useEffect, useRef } from 'react';

export const LaunchAnimation = () => {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // 2s 时开始渐隐（原 5s，缩短 3s）
    const fadeTimer = setTimeout(() => setIsFading(true), 2000);
    return () => clearTimeout(fadeTimer);
  }, []);

  useEffect(() => {
    // 进度条 1s 内 0%→100%
    const startTime = Date.now();
    const duration = 1000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(Math.round(pct));
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(animate);
      }
      if (pct === 100) {
        setIsCompleted(true);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      className={`animeContain z-1000
      ${isFading ? 'opacity-0 pointer-events-none' : ''}
      transition-opacity duration-500 ease-out`}
    >
      {/* logoW 图片 */}
      <div className="w-full h-screen relative z-20">
        <div className="absolute right-1/5 top-2/5 w-[10rem]">
          <img src="/picture/logoW.png" alt="logo" />
        </div>
        {/* 分隔线 + 标语 */}
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-1/2">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#d9d9d9]/30 to-transparent" />
          <span className="block mt-[10px] text-[#d9d9d9] text-center tracking-widest text-[0.8rem]">
            OVER THE LANSHAN/INTO THE FUTURE
          </span>
        </div>
      </div>
      {/* 滚动条 */}
      <div
        className={`progressBox w-[20px]
        ${isCompleted ? 'w-full' : ''}
        transition-all duration-1000 ease-in-out
        z-100`}
      >
        <div className="progressBar" style={{ height: `${progress}%` }}>
          <div className="progressText">
            <div className="h-[1rem] ml-[5px] relative top-[0.5rem] border-l-[5px] border-l-[#00d4ff]" />
            <span className="text-[#00d4ff] text-[2.5rem] font-medium">{progress}%</span>
            <div className={`${isCompleted ? 'invisible' : ''}`}>
              <div className="ml-[5px] flex gap-2">
                <div className="w-2 h-2 bg-[#D9D9D9]" />
                <div className="w-2 h-2 bg-[#D9D9D9]" />
              </div>
              <span className="text-[#D9D9D9]">Updating...</span>
            </div>
          </div>
        </div>
      </div>
      {/* 背景 */}
      <div className="animeBg z-10" />
    </div>
  );
};
