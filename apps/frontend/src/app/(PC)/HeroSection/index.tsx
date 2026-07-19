'use client';

import ParticleCanvas, { type ParticleCanvasHandle } from './components/ParticleCanvas';
import DotMatrixBg from './components/DotMatrixBg';
import ScrollIndicator from './components/ScrollIndicator';
import { useEffect, useLayoutEffect, useState, useRef } from 'react';

// ====== 响应式断点配置 ======
// 按视口宽度匹配：容器宽/高 + 粒子 scale
// 断点值：1520 / 1330 / 1200 / 1110
interface ResponsiveConfig {
  scale: number;
  w: number;
  h: number;
}

const RESPONSIVE_BREAKPOINTS: [number, ResponsiveConfig][] = [
  [1520, { scale: 3, w: 550, h: 550 }],
  [1330, { scale: 2.5, w: 450, h: 500 }],
  [1200, { scale: 2, w: 400, h: 500 }],
  [1110, { scale: 1.8, w: 380, h: 400 }],
  [1024, { scale: 1.7, w: 320, h: 350 }],
];

const FALLBACK_CONFIG: ResponsiveConfig = { scale: 1.5, w: 280, h: 300 };

function getResponsiveConfig(vw: number): ResponsiveConfig {
  for (const [bp, cfg] of RESPONSIVE_BREAKPOINTS) {
    if (vw >= bp) return cfg;
  }
  return FALLBACK_CONFIG;
}

export const PC_HeroSection = () => {
  const [showTrans, setShowTrans] = useState(false);
  const canvasRef = useRef<ParticleCanvasHandle>(null);
  const [boxW, setBoxW] = useState(FALLBACK_CONFIG.w);
  const [boxH, setBoxH] = useState(FALLBACK_CONFIG.h);
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
      <div className="relative z-20 flex h-screen w-full items-center justify-evenly">
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

      {/*
      // ====== 控制面板（已禁用） ======
      // 恢复时取消注释以下代码块，并补充：
      //   - import { useCallback } from 'react'
      //   - import { PARTICLE_SLIDERS, PARTICLE_DEFAULTS, type ParticleParams } from '@/lib/hero-particle-system'
      //   - panelOpen / params / showBorder / sizeUnit 状态
      //   - handleParamChange 回调
      */}
    </div>
  );
};
