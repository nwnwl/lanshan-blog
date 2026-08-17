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

// lg 断点（≥1024px）：桌面用 lm-2（旋转已烘焙进图），移动端用 lm；显式传入 imageUrl 时遵循传入值
const MOBILE_IMAGE = '/picture/lm.png';
const DESKTOP_IMAGE = '/picture/lm-2.png';

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

    // init 前收到的参数先缓存，等 ParticleSystem 创建后再补发。
    // 否则初次挂载时父组件立即 setParam 会因 ps 尚未创建而丢失，
    // 导致粒子按默认 scale=2.5 渲染，图片过大超出画布。
    const pendingParams = useRef<Array<[keyof ParticleParams, number]>>([]);

    useImperativeHandle(ref, () => ({
      setParam: (key, value) => {
        if (psRef.current) {
          psRef.current.setParam(key, value);
        } else {
          pendingParams.current.push([key, value]);
        }
      },
    }));

    useEffect(() => {
      if (!resolvedImage) return;
      const container = containerRef.current;
      if (!container) return;

      const ps = new ParticleSystem();
      psRef.current = ps;

      ps.init(container, resolvedImage)
        .then(() => {
          // 补发初始化前缓存的参数（scale/gap 等），确保首次渲染尺寸正确
          for (const [key, value] of pendingParams.current) {
            ps.setParam(key, value);
          }
          pendingParams.current = [];
        })
        .catch(() => {
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
