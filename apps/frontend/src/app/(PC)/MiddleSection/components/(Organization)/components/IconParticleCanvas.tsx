'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  IconParticleSystem,
  PARTICLE_DEFAULTS,
  // PARTICLE_SLIDERS,
  type ParticleParams,
  type IconSvgDef,
} from '../lib/IconParticleSystem';
import { iconDefs } from '@/components/Icon';

// ===== 可切换的图标列表 =====
const ICON_KEYS = [
  'react',
  'java',
  'golang',
  'figma',
  'docker',
  'python',
  'usersecret',
  'project',
  'lanshan',
] as const;

const ICON_LABELS: Record<string, string> = {
  react: 'React',
  java: 'Java',
  golang: 'Golang',
  figma: 'Figma',
  docker: 'Docker',
  python: 'Python',
  usersecret: 'User',
  project: 'Project',
  lanshan: 'Lanshan',
};

/** 个别图标需要更细的采样间距来保留细节 */
const ICON_GAP_OVERRIDES: Record<string, number> = {
  lanshan: 2,
};

/** 个别图标需要不同的缩放 */
const ICON_SCALE_OVERRIDES: Record<string, number> = {
  lanshan: 4,
};

// ===== 组件 =====

export default function IconParticleCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const psRef = useRef<IconParticleSystem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIcon, setCurrentIcon] = useState<string>('react');
  const [params, setParams] = useState<ParticleParams>({ ...PARTICLE_DEFAULTS });
  // const [panelOpen, setPanelOpen] = useState(true);

  // 初始化粒子系统
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let destroyed = false;
    const ps = new IconParticleSystem();
    psRef.current = ps;

    const iconDef = iconDefs[currentIcon] as unknown as IconSvgDef;
    if (!iconDef) {
      setError(`图标 "${currentIcon}" 未找到`);
      setLoading(false);
      return;
    }

    ps.init(container, iconDef, ICON_GAP_OVERRIDES[currentIcon], ICON_SCALE_OVERRIDES[currentIcon])
      .then(() => {
        if (!destroyed) {
          setParams({ ...ps.params });
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!destroyed) {
          setError(err instanceof Error ? err.message : '初始化失败');
          setLoading(false);
        }
      });

    return () => {
      destroyed = true;
      ps.destroy();
      psRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 切换图标
  const handleIconChange = useCallback(
    async (key: string) => {
      if (key === currentIcon || !psRef.current) return;
      setCurrentIcon(key);

      const iconDef = iconDefs[key] as unknown as IconSvgDef;
      if (!iconDef) return;

      try {
        await psRef.current.changeIcon(iconDef, ICON_GAP_OVERRIDES[key], ICON_SCALE_OVERRIDES[key]);
      } catch {
        // 忽略切换错误
      }
    },
    [currentIcon],
  );

  // ====== 控制面板（已禁用） ======
  // 恢复时取消注释以下代码块，并补充：
  //   - import { PARTICLE_SLIDERS } from '../lib/IconParticleSystem'
  //   - panelOpen 状态
  //   - handleParamChange 回调
  //   - 控制面板 JSX
  //
  // const handleParamChange = useCallback((key: keyof ParticleParams, value: number) => {
  //   setParams((prev) => ({ ...prev, [key]: value }));
  //   psRef.current?.setParam(key, value);
  // }, []);

  // 检查是否需要重采样（gap 变化时）
  useEffect(() => {
    const interval = setInterval(() => {
      if (psRef.current?.needsResample) {
        psRef.current.clearResampleFlag();
        const iconDef = iconDefs[currentIcon] as unknown as IconSvgDef;
        if (iconDef) {
          psRef.current.forceResample(
            iconDef,
            ICON_GAP_OVERRIDES[currentIcon],
            ICON_SCALE_OVERRIDES[currentIcon],
          );
        }
      }
    }, 200);
    return () => clearInterval(interval);
  }, [currentIcon]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      style={{ background: 'transparent' }}
    >
      {/* 加载/错误状态 */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-white/50 z-10 pointer-events-none">
          粒子加载中...
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-red-400 z-10 pointer-events-none">
          {error}
        </div>
      )}

      {/* 图标切换按钮 — 底部居中 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 flex-wrap justify-center">
        {ICON_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => handleIconChange(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
              ${
                currentIcon === key
                  ? 'bg-white/20 text-white border border-white/30 shadow-lg shadow-black/30'
                  : 'bg-black/50 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/80'
              }
              backdrop-blur-sm`}
          >
            {ICON_LABELS[key]}
          </button>
        ))}
      </div>

      {/* 控制面板开关按钮 */}
      {/* <button
        onClick={() => setPanelOpen((v) => !v)}
        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 border border-white/10 text-white/60 hover:text-white text-sm flex items-center justify-center backdrop-blur-sm transition-colors"
        title={panelOpen ? '关闭控制面板' : '打开控制面板'}
      >
        {panelOpen ? '×' : '☰'}
      </button> */}

      {/* 控制面板 — 右上角毛玻璃滑块面板 */}
      {/* {panelOpen && (
        <div className="absolute top-12 right-4 z-20 bg-black/70 backdrop-blur-md rounded-lg border border-white/10 p-4 w-64 text-white text-sm max-h-[80vh] overflow-y-auto">
          <h3 className="text-base font-semibold mb-3 text-white/80 select-none">粒子参数</h3>
          {PARTICLE_SLIDERS.map(({ key, label, min, max, step, format }) => (
            <div key={key} className="mb-3">
              <div className="flex justify-between mb-1">
                <label className="text-white/60 text-xs select-none">{label}</label>
                <span className="text-white/40 text-xs font-mono select-none">
                  {format ? format(params[key]) : String(params[key])}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={params[key]}
                onChange={(e) => handleParamChange(key, parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer
                         bg-white/20
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:w-3.5
                         [&::-webkit-slider-thumb]:h-3.5
                         [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:bg-white
                         [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          ))}
          <hr className="border-white/10 my-3" />
          <p className="text-white/30 text-[10px] select-none leading-relaxed">
            点击底部图标按钮切换粒子图案。
            <br />
            鼠标移动与粒子互动。
          </p>
        </div>
      )} */}
    </div>
  );
}
