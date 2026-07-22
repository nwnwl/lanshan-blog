'use client';

import ParticleCanvas, { type ParticleCanvasHandle } from './components/ParticleCanvas';
import DotMatrixBg from './components/DotMatrixBg';
import ScrollIndicator from './components/ScrollIndicator';
import { useEffect, useLayoutEffect, useState, useRef, useCallback } from 'react';
import {
  PARTICLE_DEFAULTS,
  PARTICLE_SLIDERS,
  type ParticleParams,
} from '@/lib/hero-particle-system';

// ====== 响应式断点配置 ======
// 按视口宽度匹配粒子 scale，容器大小自动计算
// 断点值：1900 / 1520 / 1330 / 1200 / 1110 / 1024
interface ResponsiveConfig {
  scale: number;
  w: number;
  h: number;
}

const RESPONSIVE_BREAKPOINTS: [number, number][] = [
  // [视口宽度, scale]
  [1900, 2.4],
  [1520, 2.0],
  [1330, 1.6],
  [1200, 1.4],
  [1110, 1.2],
  [1024, 1.0],
];

const FALLBACK_SCALE = 0.8;

// 源图采样后最大宽度 300，粒子分布范围 = 300 * scale
// 容器需要 ≥ 粒子分布范围，+20px 留点呼吸边距
function getResponsiveConfig(vw: number): ResponsiveConfig {
  let scale = FALLBACK_SCALE;
  for (const [bp, s] of RESPONSIVE_BREAKPOINTS) {
    if (vw >= bp) {
      scale = s;
      break;
    }
  }
  const size = Math.ceil(300 * scale) + 20;
  return { scale, w: size, h: size };
}

export const PC_HeroSection = () => {
  const [showTrans, setShowTrans] = useState(false);
  const canvasRef = useRef<ParticleCanvasHandle>(null);
  const [boxW, setBoxW] = useState(320);
  const [boxH, setBoxH] = useState(320);
  const [panelOpen, setPanelOpen] = useState(false);
  const [params, setParams] = useState<ParticleParams>({ ...PARTICLE_DEFAULTS });

  const handleParamChange = useCallback((key: keyof ParticleParams, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
    canvasRef.current?.setParam(key, value);
  }, []);
  useLayoutEffect(() => {
    const { w, h } = getResponsiveConfig(window.innerWidth);
    setBoxW(w);
    setBoxH(h);
  }, []);
  // 响应式：根据视口宽度自动更新容器尺寸 + 粒子 scale
  useEffect(() => {
    const applyResponsive = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cfg = getResponsiveConfig(window.innerWidth);
      setBoxW(cfg.w);
      setBoxH(cfg.h);
      // 粒子系统内部会自动 × DPR，这里只需传基础 scale
      canvasRef.current?.setParam('scale', cfg.scale);

      // ---- DEBUG: canvas 响应式参数 ----
      console.group('🎨 Hero Canvas Responsive');
      console.log('视口宽度', window.innerWidth, 'px');
      console.log('视口高度', window.innerHeight, 'px');
      console.log('devicePixelRatio (clamped)', dpr);
      console.log('基础 scale（断点匹配）', cfg.scale);
      console.log('有效 scale（基础 × dpr）', cfg.scale * dpr);
      console.log('有效 size（默认 × dpr）', PARTICLE_DEFAULTS.size * dpr);
      console.log('容器 CSS 尺寸', `${cfg.w} × ${cfg.h}`, 'px');
      console.log('Canvas 内部尺寸', `${cfg.w * dpr} × ${cfg.h * dpr}`, 'px');
      console.log(
        '粒子分布范围 (内部像素)',
        `${Math.ceil(300 * cfg.scale * dpr)} × ${Math.ceil(300 * cfg.scale * dpr)}`,
        'px',
      );
      console.log('覆盖率', `${(((300 * cfg.scale * dpr) / (cfg.w * dpr)) * 100).toFixed(1)}%`);
      console.groupEnd();
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

      {/* ====== 控制面板 ====== */}
      <button
        onClick={() => setPanelOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-white/10 p-2 text-white/60
                   backdrop-blur transition hover:bg-white/20 hover:text-white"
        title="粒子参数控制面板"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {panelOpen && (
        <div
          className="fixed bottom-14 right-4 z-50 w-64 rounded-lg border border-white/10
                     bg-[#1a1a1a]/95 p-4 backdrop-blur text-white/80 text-sm shadow-xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-white/50">粒子参数</span>
            <button
              onClick={() => setPanelOpen(false)}
              className="text-white/30 hover:text-white/80 transition"
            >
              ✕
            </button>
          </div>
          {PARTICLE_SLIDERS.map(({ key, label, min, max, step, format }) => (
            <div key={key} className="mb-2.5">
              <div className="flex justify-between text-[11px]">
                <span>{label}</span>
                <span className="text-white/50 tabular-nums">
                  {format ? format(params[key]) : params[key]}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={params[key]}
                onChange={(e) => handleParamChange(key, parseFloat(e.target.value))}
                className="mt-0.5 w-full h-1 appearance-none rounded bg-white/15
                           [&::-webkit-slider-thumb]:appearance-none
                           [&::-webkit-slider-thumb]:h-3
                           [&::-webkit-slider-thumb]:w-3
                           [&::-webkit-slider-thumb]:rounded-full
                           [&::-webkit-slider-thumb]:bg-[#00d4ff]
                           [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          ))}
          <div className="mt-3 border-t border-white/10 pt-2.5">
            <span className="text-[11px] text-white/40">容器尺寸</span>
            {(
              [
                ['W', boxW, setBoxW, 100, 1200],
                ['H', boxH, setBoxH, 100, 1200],
              ] as const
            ).map(([label, value, setter, min, max]) => (
              <div key={label} className="mb-2 mt-1">
                <div className="flex justify-between text-[11px]">
                  <span>{label}</span>
                  <span className="text-white/50 tabular-nums">{value}px</span>
                </div>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={10}
                  value={value}
                  onChange={(e) => setter(Number(e.target.value))}
                  className="mt-0.5 w-full h-1 appearance-none rounded bg-white/15
                             [&::-webkit-slider-thumb]:appearance-none
                             [&::-webkit-slider-thumb]:h-3
                             [&::-webkit-slider-thumb]:w-3
                             [&::-webkit-slider-thumb]:rounded-full
                             [&::-webkit-slider-thumb]:bg-[#00d4ff]
                             [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
