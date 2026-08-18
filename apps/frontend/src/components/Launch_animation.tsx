'use client';
import { useEffect, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { useLaunchStore } from '@/store/launchStore';
import {
  MIN_DISPLAY_MS,
  MAX_DISPLAY_MS,
  FADE_DELAY_MOBILE_MS,
  FADE_DELAY_DESKTOP_MS,
  HERO_IMAGE_MOBILE,
  HERO_IMAGE_DESKTOP,
  LOGO_IMAGE,
  BG_IMAGE,
} from '@/lib/launch-config';

/** 预加载单张图片：onload/onerror 都 resolve（失败也计为完成，防止进度卡住） */
function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    // 注意：本文件顶部 import 了 next/image，DOM 构造函数需用 window.Image
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });
}

export const LaunchAnimation = () => {
  const progress = useLaunchStore((s) => s.progress);
  const setProgress = useLaunchStore((s) => s.setProgress);
  const setLoaded = useLaunchStore((s) => s.setLoaded);

  const [isCompleted, setIsCompleted] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // 移动端（<1024px）用 lm，桌面用 lm-2（与 ParticleCanvas 断点一致）
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    const heroImage = isMobile ? HERO_IMAGE_MOBILE : HERO_IMAGE_DESKTOP;
    const resources: Promise<void>[] = [
      preloadImage(heroImage),
      preloadImage(LOGO_IMAGE),
      preloadImage(BG_IMAGE),
      document.fonts.ready.then(() => undefined), // 字体加载完成
    ];
    const total = resources.length;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let done = 0;
    let target = 0; // 真实加载进度（资源完成节点）
    let displayed = 0; // 平滑显示进度（缓动趋近 target）
    let finalized = false;
    let raf = 0;

    const finalize = () => {
      if (finalized) return;
      finalized = true;
      clearTimeout(fallbackTimer);
      setIsCompleted(true);
      setLoaded();
      timers.push(
        setTimeout(
          () => setIsFading(true),
          isMobile ? FADE_DELAY_MOBILE_MS : FADE_DELAY_DESKTOP_MS,
        ),
      );
    };

    const start = Date.now();
    const tryFinalize = () => {
      const allDone = done >= total;
      const minElapsed = Date.now() - start >= MIN_DISPLAY_MS;
      // 等进度平滑走到 100 再收尾，保证数字与扫屏/渐隐同步
      if (allDone && minElapsed && displayed >= 100) finalize();
    };

    // 帧循环：指数缓动让进度在节点之间平滑过渡（数字同步跟随，不再跳变）
    const loop = () => {
      displayed += (target - displayed) * 0.12;
      if (Math.abs(target - displayed) < 0.5) displayed = target;
      setProgress(Math.min(100, Math.round(displayed)));
      if (!finalized) {
        tryFinalize();
        raf = requestAnimationFrame(loop);
      }
    };

    const tick = () => {
      if (finalized) return;
      done += 1;
      target = Math.min(100, (done / total) * 100);
      tryFinalize();
    };

    resources.forEach((task) => void task.then(tick));
    raf = requestAnimationFrame(loop);

    // 兜底：最长等待后强制完成，防止资源卡死导致开屏永不退出
    const fallbackTimer = setTimeout(() => {
      target = 100;
      displayed = 100;
      setProgress(100);
      finalize();
    }, MAX_DISPLAY_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallbackTimer);
      timers.forEach(clearTimeout);
    };
  }, [setProgress, setLoaded]);

  return (
    <div
      className={`animeContain z-1000
      ${isFading ? 'opacity-0 pointer-events-none' : ''}
      transition-opacity duration-500 ease-out`}
    >
      {/* logoW 图片 */}
      <div className="w-full h-screen relative z-20">
        <div className="logoW absolute right-1/5 top-2/5 w-[10rem] h-[10rem]">
          <Image src="/picture/logoW.png" alt="logo" fill sizes="10rem" priority={true} />
        </div>
        {/* 分隔线 + 标语 */}
        <div className="dividerBox absolute bottom-1/4 right-1/4 translate-x-1/2 w-1/2">
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
        style={{ '--progress': `${progress}%` } as CSSProperties}
      >
        <div className="progressBar">
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
      {/* 移动端：进度满时的扫屏层（复刻桌面端 w-full 转场） */}
      <div className={`progressWipe ${isCompleted ? 'play' : ''}`} />
      {/* 背景 */}
      <div className="animeBg z-10" />
    </div>
  );
};
