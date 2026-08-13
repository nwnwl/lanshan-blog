'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { IconParticleSystem, PARTICLE_DEFAULTS, type IconSvgDef } from '../lib/IconParticleSystem';
import { iconDefs } from '@/components/Icon';
import { DepartmentPanel } from './DepartmentPanel';
import { DEPARTMENTS } from '../data/departments';

const ICON_KEYS = DEPARTMENTS.map((d) => d.key);

const ICON_GAP_OVERRIDES: Record<string, number> = {
  lanshan: 2,
};

const ICON_SCALE_OVERRIDES: Record<string, number> = {
  lanshan: 4,
};

interface Props {
  currentIcon: string;
  panelDeptKey: string;
  onIconChange: (key: string) => void;
  showContent: boolean;
  direction: 'left' | 'right';
  buttonsVisible: boolean;
  setButtonsVisible: (v: boolean) => void;
  isToggle: boolean;
}

export const IconParticleCanvas = ({
  currentIcon,
  panelDeptKey,
  onIconChange,
  showContent,
  direction,
  buttonsVisible,
  setButtonsVisible,
  isToggle,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const psRef = useRef<IconParticleSystem | null>(null);
  const mountedRef = useRef(false);
  const buttonColRef = useRef<HTMLDivElement>(null);
  const [canvasOffset, setCanvasOffset] = useState(0);
  const [ready, setReady] = useState(false);
  const [responsiveScale, setResponsiveScale] = useState(1);
  // 根字体缩放因子：html font-size / 16，跟随 fluid 缩放（useDesignScale）连续变化
  const [fontScale, setFontScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [inView, setInView] = useState(false);
  // 初次进入（滚动进入视口时内容已展示 = 移动端自动进入）或视口从大屏跨入小屏：文字入场延迟 -1s；点击切换恢复完整延迟
  // 渲染期派生（非 setState）：transition 在「面板首次可见的那帧」就按当时的 delay 排程，事后改 className 不会重启已排程的过渡
  // 用真实视口宽度而非防抖后的 isMobile：showContent 只在 width<1024 时通过自动进入变 true，首帧即正确
  const initialEntrance = showContent && typeof window !== 'undefined' && window.innerWidth < 1024;

  const responsiveRef = useRef(responsiveScale);
  responsiveRef.current = responsiveScale;
  const fontRef = useRef(fontScale);
  fontRef.current = fontScale;

  // 响应式缩放更新（轻量，不重采样）+ lg 以下移动端标记
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1280) setResponsiveScale(1);
      else if (w >= 1024) setResponsiveScale(0.7);
      else setResponsiveScale(0.8);
      setIsMobile(w < 1024);
      // 同步读取根字体 → 粒子尺寸跟着 fluid 缩放走
      setFontScale(parseFloat(getComputedStyle(document.documentElement).fontSize) / 16);
    };
    update(); // 首载立即应用
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(update, 150); // 防抖：停止拉伸 150ms 后再应用
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(timer);
    };
  }, []);

  // 初始化粒子系统（进入视口后才创建，粒子从随机位置飞入 + 淡入）
  useEffect(() => {
    if (!inView) return;
    const container = containerRef.current;
    if (!container) return;
    let destroyed = false;
    const ps = new IconParticleSystem();
    psRef.current = ps;
    const iconDef = iconDefs[currentIcon] as unknown as IconSvgDef;
    if (!iconDef) return;
    const scale =
      (ICON_SCALE_OVERRIDES[currentIcon] ?? 3) * responsiveRef.current * fontRef.current;
    const gapDiv = responsiveRef.current <= 0.5 ? 0.5 : 1;
    const gap = (ICON_GAP_OVERRIDES[currentIcon] ?? PARTICLE_DEFAULTS.gap) / gapDiv;
    ps.init(container, iconDef, gap, scale)
      .then(() => {
        if (!destroyed) {
          mountedRef.current = true;
          setReady(true);
        }
      })
      .catch(() => {});
    return () => {
      destroyed = true;
      ps.destroy();
      psRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // 同步 currentIcon → 粒子系统
  useEffect(() => {
    if (!mountedRef.current || !psRef.current) return;
    const iconDef = iconDefs[currentIcon] as unknown as IconSvgDef;
    if (!iconDef) return;
    const scale =
      (ICON_SCALE_OVERRIDES[currentIcon] ?? 3) * responsiveRef.current * fontRef.current;
    const gapDiv = responsiveRef.current <= 0.5 ? 0.5 : 1;
    const gap = (ICON_GAP_OVERRIDES[currentIcon] ?? PARTICLE_DEFAULTS.gap) / gapDiv;
    psRef.current.changeIcon(iconDef, gap, scale).catch(() => {});
  }, [currentIcon]);

  // 按钮点击 → 退出动画 + 切换
  const handleIconChange = useCallback(
    (key: string) => {
      if (!psRef.current || showContent) return;
      setButtonsVisible(false);
      onIconChange(key);
    },
    [onIconChange, showContent],
  );

  // 响应式缩放：轻量更新粒子 scale + size，不重采样
  useEffect(() => {
    if (!ready || !psRef.current) return;
    const baseScale = ICON_SCALE_OVERRIDES[currentIcon] ?? 3;
    const gapDiv = responsiveScale <= 0.5 ? 0.5 : 1;
    const baseGap = ICON_GAP_OVERRIDES[currentIcon] ?? PARTICLE_DEFAULTS.gap;
    psRef.current.setParam('scale', baseScale * responsiveScale * fontScale);
    psRef.current.setParam('size', 2 * responsiveScale * fontScale);
    psRef.current.setParam('gap', baseGap / gapDiv);
  }, [responsiveScale, ready, currentIcon, fontScale]);

  // 进入视口一次性触发：粒子初始化（全端）+ 按钮列入场（仅 ≥lg）
  // 观察 canvas 容器而非按钮列：按钮列 max-lg:hidden，移动端 display:none 永远不会触发
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true); // 粒子进入视口才初始化
        if (window.innerWidth >= 1024) setButtonsVisible(true); // 小屏按钮显隐由自动切换/返回控制
        obs.disconnect(); // 只触发一次，之后不再监听
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // 计算 canvas 从 content 位置到 default 位置的 translateX 偏移量
  // 内容时左 1/4，默认时右 3/4 → 偏移量 = w/2
  useEffect(() => {
    const el = containerRef.current;
    const parent = el?.parentElement;
    if (!parent) return;

    const update = () => setCanvasOffset(parent.offsetWidth / 2);
    update(); // 首载立即计算

    let timer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(update, 150); // 防抖：停止拉伸 150ms 后再计算偏移
    });
    ro.observe(parent);
    return () => {
      ro.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // 重采样
  useEffect(() => {
    const interval = setInterval(() => {
      if (psRef.current?.needsResample) {
        psRef.current.clearResampleFlag();
        const iconDef = iconDefs[currentIcon] as unknown as IconSvgDef;
        if (iconDef)
          psRef.current.forceResample(
            iconDef,
            (ICON_GAP_OVERRIDES[currentIcon] ?? PARTICLE_DEFAULTS.gap) /
              (responsiveRef.current <= 0.5 ? 0.5 : 1),
            (ICON_SCALE_OVERRIDES[currentIcon] ?? 3) * responsiveRef.current * fontRef.current,
          );
      }
    }, 200);
    return () => clearInterval(interval);
  }, [currentIcon]);

  return (
    <div className="relative w-full h-full flex max-lg:flex-col max-lg:justify-end justify-center 2xl:justify-evenly">
      {/* 按钮列 — 退出后折叠 */}
      <div
        ref={buttonColRef}
        className={`max-lg:hidden w-[16.25rem] lg:w-[25rem] xl:w-[33.125rem] h-full
          flex flex-col justify-center 
          z-20 
          pb-[calc((100vw-1rem)*1/15+1rem)]
          transition-all
           ${
             buttonsVisible
               ? 'opacity-100 duration-700 ease-out'
               : 'opacity-0 duration-300 ease-in pointer-events-none'
           }`}
      >
        {ICON_KEYS.map((key, i) => {
          const dept = DEPARTMENTS.find((d) => d.key === key);
          const cn = dept?.cn ?? '';
          const en = dept?.en ?? '';
          return (
            <div
              key={key}
              onClick={() => handleIconChange(key)}
              style={{ transitionDelay: `${i * 50}ms` }}
              className={`h-[3.8rem] xl:h-[4rem] min-[1920px]:text-2xl text-left pl-8
            relative flex items-end 
            bg-transparent border-0 border-b border-white
            group cursor-pointer
            transition-all
            ${
              buttonsVisible
                ? 'translate-x-0 opacity-100 duration-700 ease-out'
                : '-translate-x-full opacity-0 duration-300 ease-in'
            }
            `}
            >
              {/* 背景英文字 */}
              <div
                className="absolute inset-0 flex items-center justify-end pr-2
                  text-[1.92rem] font-bold text-[#00d4ff]
                  opacity-0 group-hover:opacity-25 transition-opacity duration-300 ease-out
                  pointer-events-none select-none"
              >
                <span> {en}</span>
              </div>
              {/* 按钮白色文字 */}
              <div
                className="relative z-10 
                transition-all duration-300 ease-out
                text-[#ABABAB]
                group-hover:translate-x-2 
                group-hover:text-white
                font-bold"
              >
                <span className="text-[1.6rem] xl:text-[1.8rem]">{cn}</span>
                <span className="text-[0.8rem] xl:text-[1rem] ml-4">{en}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-1/2 max-lg:w-full lg:h-full lg:w-[25rem] xl:w-[33.125rem] pb-[calc((100vw-1rem)*1/15+1rem)]  px-0 lg:pr-20">
        <DepartmentPanel
          deptKey={panelDeptKey}
          direction={direction}
          visible={showContent}
          inView={inView}
          initialEntrance={initialEntrance}
          isToggle={isToggle}
        />
      </div>

      {/* canvas 粒子 — 内容时左移，默认在右（仅 ≥lg 生效；lg 以下直接居中） */}
      {/* 使用 transform 而非 left 做动画：GPU 合成线程执行，避免重排卡顿 */}
      <div
        ref={containerRef}
        className="absolute top-0 h-4/5 lg:h-[calc(100vh-((100vw-1rem)*1/15+1rem))] max-lg:w-full w-[33.125rem] bg-transparent will-change-transform"
        style={
          isMobile
            ? { left: '50%', transform: 'translateX(-50%)' }
            : {
                left: '25%',
                transform: showContent
                  ? 'translateX(-50%)'
                  : `translateX(calc(-50% + ${canvasOffset}px))`,
                transition: `transform 1000ms ease-in-out`,
              }
        }
      />
    </div>
  );
};
