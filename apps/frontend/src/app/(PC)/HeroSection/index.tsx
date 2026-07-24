'use client';

import ParticleCanvas, { type ParticleCanvasHandle } from './components/ParticleCanvas';
import { DotMatrixBg } from './components/DotMatrixBg';
import { ScrollIndicator } from './components/ScrollIndicator';
import { useEffect, useLayoutEffect, useState, useRef } from 'react';

// ====== 响应式断点配置 ======
// 按视口宽度匹配：粒子 scale / gap + 容器宽/高
interface ResponsiveConfig {
  scale: number;
  gap: number;
  w: number;
  h: number;
}

const RESPONSIVE_BREAKPOINTS: [number, number, number, number, number][] = [
  // [视口宽度, scale, gap, w, h]
  [1900, 2.4, 2, 740, 740],
  [1520, 1.8, 2, 620, 620],
  [1330, 1.6, 2, 500, 500],
  [1200, 1.3, 3, 440, 440],
  [1110, 1.2, 3, 380, 380],
  [1024, 1.1, 3, 320, 320],
];

const FALLBACK_CONFIG: ResponsiveConfig = { scale: 0.8, gap: 2, w: 260, h: 260 };

function getResponsiveConfig(vw: number): ResponsiveConfig {
  for (const [bp, scale, gap, w, h] of RESPONSIVE_BREAKPOINTS) {
    if (vw >= bp) return { scale, gap, w, h };
  }
  return FALLBACK_CONFIG;
}

export const PC_HeroSection = () => {
  const [showTrans, setShowTrans] = useState(false);
  const canvasRef = useRef<ParticleCanvasHandle>(null);
  const [boxW, setBoxW] = useState(320);
  const [boxH, setBoxH] = useState(320);

  useLayoutEffect(() => {
    const { w, h } = getResponsiveConfig(window.innerWidth);
    setBoxW(w);
    setBoxH(h);
  }, []);
  // 响应式：根据视口宽度自动更新容器尺寸 + 粒子 scale
  useEffect(() => {
    const applyResponsive = () => {
      const cfg = getResponsiveConfig(window.innerWidth);
      setBoxW(cfg.w);
      setBoxH(cfg.h);
      canvasRef.current?.setParam('scale', cfg.scale);
      canvasRef.current?.setParam('gap', cfg.gap);
    };

    applyResponsive();

    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(applyResponsive, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const removeTimer = setTimeout(() => {
      setShowTrans(true);
    }, 8000);
    return () => {
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <div id="hero" className="part relative h-screen w-full overflow-hidden bg-[#191919]">
      {/* 点阵数字背景 */}
      <DotMatrixBg />

      {/* 前景：左侧文字 + 右侧粒子容器 */}
      <div className="relative z-20 flex h-screen w-full items-center justify-center">
        {/* 左侧文字 */}
        <div className="select-none">
          <div className="indent-[3px] text-[clamp(16px,4.8vw,24px)] leading-none text-[#00d4ff]">
            <span
              className={`${showTrans ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'} 
              transition-all delay-200 duration-700 ease-out`}
            >
              WEB DEVELOPOMENT CLUB
            </span>
          </div>
          <div className="indent-[3px] text-[10px] text-[#d9d9d98f]">
            <span
              className={`${showTrans ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'} 
              transition-all delay-300 duration-700 ease-out
              mb-[1rem]`}
            >
              DIGITAL PRODUCTS · INTELLIGENT SYSTEMS · USER-CENTRIC DESIGN
            </span>
          </div>
          <div className="text-[clamp(3rem,5vw+5rem,10rem)] leading-none text-[#00d4ff]">
            <span
              className={`${showTrans ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} 
              transition-all delay-100 duration-700 ease-out`}
            >
              蓝山
            </span>
          </div>
          <div className="overflow-hidden text-[clamp(3rem,5vw+5rem,10rem)] leading-none text-[#ffffff]">
            <span
              className={`${showTrans ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} transition-all duration-700 ease-out`}
            >
              工作室
            </span>
          </div>
        </div>

        {/* 右侧粒子画布容器 */}
        <div className="relative z-10 rounded-lg" style={{ width: boxW, height: boxH }}>
          <ParticleCanvas ref={canvasRef} className="absolute inset-0" />
        </div>
      </div>

      {/* 滚动提示倒三角 */}
      <ScrollIndicator />
    </div>
  );
};
