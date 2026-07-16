'use client';

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
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
  function ParticleCanvas({ imageUrl = '/picture/lm.png', className, style }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const psRef = useRef<ParticleSystem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      setParam: (key, value) => {
        psRef.current?.setParam(key, value);
      },
    }));

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      let destroyed = false;
      const ps = new ParticleSystem();
      psRef.current = ps;

      ps.init(container)
        .then(() => {
          if (!destroyed) setLoading(false);
        })
        .catch((err: unknown) => {
          if (!destroyed) {
            setError(err instanceof Error ? err.message : 'Failed to init');
            setLoading(false);
          }
        });

      return () => {
        destroyed = true;
        ps.destroy();
        psRef.current = null;
      };
    }, [imageUrl]);

    return (
      <div ref={containerRef} className={className} style={{ background: 'transparent', ...style }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm">
            蓝妹正在跨越次元壁...
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>
    );
  },
);

export default ParticleCanvas;
