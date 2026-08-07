'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { ParticleSystem, type ParticleParams } from '@/lib/hero-particle-system';

export interface ParticleCanvasHandle {
  setParam: <K extends keyof ParticleParams>(key: K, value: ParticleParams[K]) => void;
}

interface ParticleCanvasProps {
  imageUrl?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ParticleCanvas = forwardRef<ParticleCanvasHandle, ParticleCanvasProps>(
  function ParticleCanvas({ imageUrl = '/picture/lm-1.png', className, style }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const psRef = useRef<ParticleSystem | null>(null);

    useImperativeHandle(ref, () => ({
      setParam: (key, value) => {
        psRef.current?.setParam(key, value);
      },
    }));

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const ps = new ParticleSystem();
      psRef.current = ps;

      ps.init(container).catch(() => {
        // 忽略初始化错误
      });

      return () => {
        ps.destroy();
        psRef.current = null;
      };
    }, [imageUrl]);

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
