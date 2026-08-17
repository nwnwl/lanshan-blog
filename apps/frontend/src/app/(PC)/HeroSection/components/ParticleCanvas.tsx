'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { ParticleSystem, type ParticleParams } from '@/lib/hero-particle-system';

export interface ParticleCanvasHandle {
  setParam: <K extends keyof ParticleParams>(key: K, value: ParticleParams[K]) => void;
}

interface ParticleCanvasProps {
  imageUrl?: string;
  className?: string;
  style?: React.CSSProperties;
}

// lg 断点（≥1024px）：桌面用 lm-1，移动端用 lm；显式传入 imageUrl 时遵循传入值
const MOBILE_IMAGE = '/picture/lm.png';
const DESKTOP_IMAGE = '/picture/lm-1.png';

const ParticleCanvas = forwardRef<ParticleCanvasHandle, ParticleCanvasProps>(
  function ParticleCanvas({ imageUrl, className, style }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const psRef = useRef<ParticleSystem | null>(null);

    // SSR 阶段 window 不可用，所以延迟到客户端 effect 里解析最终图片地址
    const [resolvedImage, setResolvedImage] = useState<string | null>(null);

    useEffect(() => {
      const pickImage = () => {
        if (imageUrl) {
          setResolvedImage(imageUrl);
        } else {
          setResolvedImage(
            window.matchMedia('(min-width: 1024px)').matches ? DESKTOP_IMAGE : MOBILE_IMAGE,
          );
        }
      };

      pickImage();

      // 只在跨越 1024px 断点时触发，避免每次 resize 都重建粒子系统
      const mq = window.matchMedia('(min-width: 1024px)');
      mq.addEventListener('change', pickImage);
      return () => mq.removeEventListener('change', pickImage);
    }, [imageUrl]);

    useImperativeHandle(ref, () => ({
      setParam: (key, value) => {
        psRef.current?.setParam(key, value);
      },
    }));

    useEffect(() => {
      if (!resolvedImage) return;
      const container = containerRef.current;
      if (!container) return;

      const ps = new ParticleSystem();
      psRef.current = ps;

      ps.init(container, resolvedImage).catch(() => {
        // 忽略初始化错误
      });

      return () => {
        ps.destroy();
        psRef.current = null;
      };
    }, [resolvedImage]);

    return (
      <div
        ref={containerRef}
        className={className}
        style={{ background: 'transparent', ...style }}
      />
    );
  },
);

export default ParticleCanvas;
