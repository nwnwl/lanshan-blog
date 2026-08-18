'use client';

import ParticleCanvas, { type ParticleCanvasHandle } from './components/ParticleCanvas';
import PixelBlast from './components/PixelBlast';
import { ScrollIndicator } from './components/ScrollIndicator';
import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTransitionStore } from '@/store/transitionStore';
import './hero.css';

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
  [1520, 2.2, 2, 740, 740],
  [1330, 1.8, 2, 630, 630],
  [1200, 1.6, 3, 500, 500],
  [1110, 1.4, 3, 440, 440],
  [1025, 1.2, 3, 380, 380],
  [768, 1.7, 2, 500, 500],
  [640, 1.6, 2, 420, 450],
  [500, 1.3, 2, 350, 350],
  [0, 1.1, 2, 320, 320],
];

const FALLBACK_CONFIG: ResponsiveConfig = { scale: 0.8, gap: 2, w: 260, h: 260 };

function getResponsiveConfig(vw: number): ResponsiveConfig {
  for (const [bp, scale, gap, w, h] of RESPONSIVE_BREAKPOINTS) {
    if (vw >= bp) return { scale, gap, w, h };
  }
  return FALLBACK_CONFIG;
}

export const PC_HeroSection = () => {
  const router = useRouter();
  const navigate = useTransitionStore((s) => s.navigate);
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
    <div
      id="hero"
      className="part relative min-h-[600px] h-screen w-full overflow-hidden bg-[#191919]"
    >
      <div
        className="absolute top-0 w-full
        flex justify-between z-50
        pt-[1rem] px-[2rem]
      "
      >
        <div className="h-full font-bold">
          {/* 顶部左主标题：WEB DEVELOPOMENT CLUB（桌面 + 移动端均显示）
              字号改这里：text-[clamp(14px,3vw,24px)] → 最小14px / 随屏缩放3vw / 最大24px */}
          <div className="text-[clamp(14px,3vw,24px)] lg:ding-none text-[#ffffff] ">
            <span
              className={`${showTrans ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'} transition-all delay-200 duration-700 ease-out`}
            >
              WEB DEVELOPOMENT CLUB
            </span>
          </div>
          {/* 顶部左副标题：DIGITAL PRODUCTS ···，仅桌面显示（max-lg:hidden），移动端改为下方青色清单
              字号改这里：text-[10px] */}
          <div className="max-lg:hidden text-[10px] text-[#00d4ff]">
            <span
              className={`${showTrans ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'} transition-all delay-300 duration-700 ease-out`}
            >
              DIGITAL PRODUCTS · INTELLIGENT SYSTEMS · USER-CENTRIC DESIGN
            </span>
          </div>
        </div>
        {/* 顶部右：Join Us 入口，点击跳转 /join，字号与左侧主标题联动
            字号改这里：text-[clamp(14px,3vw,24px)] */}
        <div
          onClick={() => navigate('/join', router.push)}
          className="heroJoin  h-full text-[clamp(14px,3vw,24px)]"
        >
          <span className="text-white font-bold">Join Us</span>
        </div>
      </div>
      {/* 桌面左下角：工作室英文名，仅桌面显示（max-lg:hidden），字号随 span 内 font-bold 默认 */}
      <div
        className="absolute left-0 bottom-0
      pl-[2rem] pb-[1rem] z-50
      max-lg:hidden"
      >
        <span className="text-white font-bold">CQUPT LANSHAN STUDIO</span>
      </div>
      {/* 背景：PixelBlast bayer 抖动全屏效果 */}
      <div className="absolute inset-0 z-0">
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
      <div
        className="pointer-events-none relative flex min-h-[650px] h-screen w-full items-center justify-center lg:gap-20 max-lg:flex-col max-lg:gap-10
      lg:pl-[4rem]"
      >
        {/* 左侧主文字组：桌面端随 flex 居中；移动端（max-lg）绝对定位在左下角
            位置改这里：max-lg:left-[2rem] max-lg:bottom-[8rem] */}
        <div
          className="select-none 
          max-lg:flex max-lg:flex-col max-lg:items-start max-lg:gap-5
          max-lg:absolute  max-lg:bottom-[8rem]
          max-sm:left-[2rem] max-md:left-[4rem] max-lg:left-[6rem]
          "
        >
          {/* 主视觉标题："蓝山"（青色大字）
              字号改这里：text-[clamp(3rem,5vw+3rem,10rem)] → 最小3rem / 随屏缩放5vw+3rem / 最大10rem */}
          <div className="text-[clamp(5rem,6vw+4rem,10rem)] leading-none text-[#00d4ff]">
            <span
              className={`${showTrans ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} 
              transition-all delay-100 duration-700 ease-out
              font-black`}
            >
              蓝山
            </span>
          </div>
          {/* 主视觉标题："工作室"（白色大字），字号同上（与"蓝山"保持一致） */}
          <div className="overflow-hidden text-[clamp(5rem,6vw+4rem,10rem)] leading-none text-[#ffffff]">
            <span
              className={`${showTrans ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} 
              transition-all duration-700 ease-out
              font-black`}
            >
              工作室
            </span>
          </div>
          {/* 移动端：工作室英文名，仅移动端显示（lg:hidden），桌面端改在左下角那行
              字号改这里：text-[1.5rem] */}
          <div className="lg:hidden">
            <span className="indent-[3px] text-white font-medium text-[1.5rem]">
              CQUPT LANSHAN STUDIO
            </span>
          </div>
          {/* 移动端：副标题三条（青绿色小字），仅移动端显示（lg:hidden）
              字号改这里：text-[0.8rem] */}
          <div
            className="lg:hidden text-[#00d4ff] flex flex-col
          text-[0.8rem] font-medium indent-[3px]
          "
          >
            <span>· DIGITAL PRODUCTS </span>
            <span>· INTELLIGENT SYSTEMS</span>
            <span>· USER-CENTRIC DESIGN</span>
          </div>
        </div>

        {/* 右侧粒子画布容器：旋转已烘焙进桌面端图片（lm-2），不再用 CSS rotate；移动端（max-lg）绝对定位在右下
            容器宽高 boxW/boxH 由顶部 RESPONSIVE_BREAKPOINTS 配置控制 */}
        <div
          className="relative z-10 rounded-lg
          max-lg:absolute max-lg:left-[calc(50%-2rem)]
          max-lg:bottom-1/4
          max-lg:-translate-y-1/6  
          max-md:-translate-x-1/4  max-lg:-translate-x-1/5 
          "
          style={{ width: boxW, height: boxH }}
        >
          <ParticleCanvas ref={canvasRef} className="absolute inset-0" />
        </div>
      </div>

      {/* 滚动提示倒三角 */}
      <ScrollIndicator />
    </div>
  );
};
