'use client';

import ParticleCanvas, { type ParticleCanvasHandle } from './components/ParticleCanvas';
import PixelBlast from './components/PixelBlast';
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
  [1024, 1.1, 3, 350, 350],
  [640, 1, 3, 350, 350],
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
    // 移动端（<1024px）与开场动画同步 1.5s 出现文字；桌面保持 2s
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    const removeTimer = setTimeout(
      () => {
        setShowTrans(true);
      },
      isMobile ? 1500 : 2000,
    );
    return () => {
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <div id="hero" className="part relative h-screen w-full overflow-hidden bg-[#191919]">
      {/* 背景：PixelBlast bayer 抖动全屏效果 */}
      <div className="absolute inset-0">
        <PixelBlast
          variant="square"
          pixelSize={3}
          color="#171717"
          patternScale={3}
          patternDensity={1}
          pixelSizeJitter={0.6}
          enableRipples={false}
          liquid={true}
          liquidStrength={0.05}
          liquidRadius={0.5}
          liquidWobbleSpeed={1}
          speed={1}
          edgeFade={0}
          transparent
        />
      </div>

      {/* 前景：左侧文字 + 右侧粒子容器（pointer-events-none 让指针事件穿透到 z-0 的 PixelBlast 背景 canvas） */}
      <div className="pointer-events-none relative flex min-h-[650px] h-screen w-full items-center justify-center lg:gap-20 max-lg:flex-col max-lg:gap-10">
        {/* 左侧文字：max-lg 下所有文字居中排列 */}
        <div className="select-none max-lg:text-center">
          <div className="indent-[3px] text-[clamp(16px,4.8vw,24px)] leading-none text-[#00d4ff] max-lg:indent-0">
            <span
              className={`${showTrans ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'} transition-all delay-200 duration-700 ease-out`}
            >
              WEB DEVELOPOMENT CLUB
            </span>
          </div>
          <div className="indent-[3px] text-[10px] text-[#d9d9d98f] max-lg:indent-0 max-lg:mt-2">
            <span
              className={`${showTrans ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'} transition-all delay-300 duration-700 ease-out
              mb-[1rem] font-bold`}
            >
              DIGITAL PRODUCTS<span className="max-lg:hidden!"> · </span>
              <br className="hidden max-lg:inline" />
              INTELLIGENT SYSTEMS · USER-CENTRIC DESIGN
            </span>
          </div>
          <div className="text-[clamp(3rem,5vw+5rem,10rem)] leading-none text-[#00d4ff] max-lg:mt-8 mb-4">
            <span
              className={`${showTrans ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} 
              transition-all delay-100 duration-700 ease-out
              font-black`}
            >
              蓝山
            </span>
          </div>
          <div className="overflow-hidden text-[clamp(3rem,5vw+5rem,10rem)] leading-none text-[#ffffff]">
            <span
              className={`${showTrans ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} 
              transition-all duration-700 ease-out
              font-black`}
            >
              工作室
            </span>
          </div>
        </div>

        {/* 右侧粒子画布容器：max-lg 下 order-2 排在文案容器上方 */}
        <div className="relative z-10 rounded-lg" style={{ width: boxW, height: boxH }}>
          <ParticleCanvas ref={canvasRef} className="absolute inset-0" />
        </div>
      </div>

      {/* 滚动提示倒三角 */}
      <ScrollIndicator />
    </div>
  );
};
