'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { IconParticleSystem, type IconSvgDef } from '../lib/IconParticleSystem';
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

  const responsiveRef = useRef(responsiveScale);
  responsiveRef.current = responsiveScale;

  // 响应式缩放更新（轻量，不重采样）
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1280) setResponsiveScale(1);
      else if (w >= 1024) setResponsiveScale(0.7);
      else setResponsiveScale(0.5);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // 初始化粒子系统
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let destroyed = false;
    const ps = new IconParticleSystem();
    psRef.current = ps;
    const iconDef = iconDefs[currentIcon] as unknown as IconSvgDef;
    if (!iconDef) return;
    const scale = (ICON_SCALE_OVERRIDES[currentIcon] ?? 3) * responsiveRef.current;
    ps.init(container, iconDef, ICON_GAP_OVERRIDES[currentIcon], scale)
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
  }, []);

  // 同步 currentIcon → 粒子系统
  useEffect(() => {
    if (!mountedRef.current || !psRef.current) return;
    const iconDef = iconDefs[currentIcon] as unknown as IconSvgDef;
    if (!iconDef) return;
    const scale = (ICON_SCALE_OVERRIDES[currentIcon] ?? 3) * responsiveRef.current;
    psRef.current.changeIcon(iconDef, ICON_GAP_OVERRIDES[currentIcon], scale).catch(() => {});
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
    psRef.current.setParam('scale', baseScale * responsiveScale);
    psRef.current.setParam('size', 2 * responsiveScale);
  }, [responsiveScale, ready, currentIcon]);

  // 入场动画
  useEffect(() => {
    const el = buttonColRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setButtonsVisible(true);
        }
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
    update();

    const ro = new ResizeObserver(update);
    ro.observe(parent);
    return () => ro.disconnect();
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
            ICON_GAP_OVERRIDES[currentIcon],
            (ICON_SCALE_OVERRIDES[currentIcon] ?? 3) * responsiveRef.current,
          );
      }
    }, 200);
    return () => clearInterval(interval);
  }, [currentIcon]);

  return (
    <div className="relative w-full h-full flex justify-center">
      {/* 按钮列 — 退出后折叠 */}
      <div
        ref={buttonColRef}
        className={`w-[300px] lg:w-[400px] xl:w-[530px] h-full 
          flex flex-col justify-center 
          z-20 
          pb-[6.7vw]
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
              className={`h-[80px] text-left pl-8
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
                className="absolute inset-0 flex items-center justify-end pr-10
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
                <span className="text-[1.6rem]">{cn}</span>
                <span className="text-[0.8rem] ml-4">{en}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-full w-[300px] lg:w-[400px] xl:w-[530px]   px-0 lg:px-10">
        <DepartmentPanel
          deptKey={panelDeptKey}
          direction={direction}
          visible={showContent}
          isToggle={isToggle}
        />
      </div>

      {/* canvas 粒子 — 内容时左移，默认在右 */}
      {/* 使用 transform 而非 left 做动画：GPU 合成线程执行，避免重排卡顿 */}
      <div
        ref={containerRef}
        className="absolute top-0 h-full w-[300px] lg:w-[400px] xl:w-[530px] bg-transparent will-change-transform"
        style={{
          left: '25%',
          transform: showContent
            ? 'translateX(-50%)'
            : `translateX(calc(-50% + ${canvasOffset}px))`,
          transition: `transform 1000ms ease-in-out`,
        }}
      />
    </div>
  );
};
