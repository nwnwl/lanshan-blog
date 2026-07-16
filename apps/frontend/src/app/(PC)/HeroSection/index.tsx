'use client';

import ParticleCanvas, { type ParticleCanvasHandle } from './components/ParticleCanvas';
import DotMatrixBg from './components/DotMatrixBg';
import ScrollIndicator from './components/ScrollIndicator';
import { useEffect, useState, useRef } from 'react';

// ====== 响应式断点配置 ======
// 按视口宽度匹配：容器宽/高 + 粒子 scale
// 断点值：1520 / 1330 / 1200 / 1110
interface ResponsiveConfig {
  scale: number;
  w: number;
  h: number;
}

const RESPONSIVE_BREAKPOINTS: [number, ResponsiveConfig][] = [
  [1520, { scale: 2.5, w: 450, h: 550 }],
  [1330, { scale: 2, w: 400, h: 500 }],
  [1200, { scale: 1.8, w: 380, h: 400 }],
  [1110, { scale: 1.7, w: 320, h: 350 }],
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
  const [boxW, setBoxW] = useState(() => getResponsiveConfig(window.innerWidth).w);
  const [boxH, setBoxH] = useState(() => getResponsiveConfig(window.innerWidth).h);

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
    <div id="hero" className="part relative h-screen w-full bg-black/90 overflow-hidden">
      {/* 点阵数字背景 */}
      <DotMatrixBg />

      {/* 前景：左侧文字 + 右侧粒子容器 */}
      <div className="relative z-20 w-full h-screen flex items-center justify-center">
        {/* 左侧文字 */}
        <div className="select-none">
          <div className="leading-none text-[#00d4ff] text-[clamp(16px,4.8vw,24px)]">
            <span
              className={`${showTrans ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
              transition-all duration-700 ease-out
              delay-200`}
            >
              WEB DEVELOPOMENT CLUB
            </span>
          </div>
          <div className="leading-none text-[#d9d9d98f] text-[10px]">
            <span
              className={`${showTrans ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
              transition-all duration-700 ease-out
              delay-300`}
            >
              DIGITAL PRODUCTS · INTELLIGENT SYSTEMS · USER-CENTRIC DESIGN
            </span>
          </div>
          <div className="leading-none text-[#ffffff] text-[clamp(3rem,5vw+5rem,10rem)]">
            <span
              className={`${showTrans ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}
              transition-all duration-700 ease-out
              delay-100`}
            >
              STUDIO
            </span>
          </div>
          <div
            className="
          leading-none text-[#00d4ff] text-[clamp(3rem,5vw+5rem,10rem)]
          overflow-hidden"
          >
            <span
              className={`${showTrans ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}
              transition-all duration-700 ease-out
              `}
            >
              LANSHAN
            </span>
          </div>
        </div>

        {/* 右侧粒子画布容器 */}
        <div
          className="relative rounded-lg overflow-hidden z-10"
          style={{ width: boxW, height: boxH }}
        >
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
