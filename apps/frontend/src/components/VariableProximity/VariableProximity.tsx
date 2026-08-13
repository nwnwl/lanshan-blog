'use client';

import { forwardRef, useMemo, useRef, useEffect, useCallback } from 'react';
import { Roboto_Flex } from 'next/font/google';
import './VariableProximity.css';

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  display: 'swap',
});

const SMOOTHING = 0.15;

interface VariableProximityProps {
  label: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  containerRef?: React.RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

function useMousePositionRef(containerRef?: React.RefObject<HTMLElement | null>) {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (ev: MouseEvent) => updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
}

const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>((props, ref) => {
  const {
    label,
    fromFontVariationSettings = "'wght' 400, 'opsz' 9",
    toFontVariationSettings = "'wght' 800, 'opsz' 40",
    containerRef,
    radius = 50,
    falloff = 'linear',
    className = '',
    onClick,
    style,
    ...restProps
  } = props;

  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const falloffRef = useRef<number[]>(Array.from({ length: label.length }, () => 0));
  const mousePositionRef = useMousePositionRef(containerRef);
  const selfRef = useRef<HTMLSpanElement | null>(null);

  const parsedSettings = useMemo(() => {
    const parseSettings = (settingsStr: string) =>
      new Map(
        settingsStr
          .split(',')
          .map((s) => s.trim())
          .map((s) => {
            const [name, value] = s.split(' ');
            return [name.replace(/['"]/g, ''), parseFloat(value)];
          }),
      );

    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calculateDistance = useCallback(
    (x1: number, y1: number, x2: number, y2: number) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2),
    [],
  );

  const calculateFalloff = useCallback(
    (distance: number) => {
      const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
      switch (falloff) {
        case 'exponential':
          return norm ** 2;
        case 'gaussian':
          return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
        case 'linear':
        default:
          return norm;
      }
    },
    [radius, falloff],
  );

  const updateLetters = useCallback(() => {
    const self = selfRef.current;
    if (!self || !containerRef?.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const { x, y } = mousePositionRef.current;

    const selfRect = self.getBoundingClientRect();
    const inside =
      x >= selfRect.left - containerRect.left &&
      x <= selfRect.right - containerRect.left &&
      y >= selfRect.top - containerRect.top &&
      y <= selfRect.bottom - containerRect.top;

    letterRefs.current.forEach((letterRef, index) => {
      if (!letterRef) return;

      let target = 0;
      if (inside) {
        const rect = letterRef.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
        const letterCenterY = rect.top + rect.height / 2 - containerRect.top;
        const distance = calculateDistance(x, y, letterCenterX, letterCenterY);
        target = distance >= radius ? 0 : calculateFalloff(distance);
      }

      const current = falloffRef.current[index];
      const next = current + (target - current) * SMOOTHING;
      const settled = Math.abs(next - target) < 0.001 ? target : next;
      falloffRef.current[index] = settled;

      const newSettings = parsedSettings
        .map(({ axis, fromValue, toValue }) => {
          const v = fromValue + (toValue - fromValue) * settled;
          return `'${axis}' ${v}`;
        })
        .join(', ');
      letterRef.style.fontVariationSettings = newSettings;
    });
  }, [containerRef, mousePositionRef, calculateDistance, calculateFalloff, parsedSettings, radius]);

  useEffect(() => {
    let frameId: number;
    const loop = () => {
      updateLetters();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [updateLetters]);

  const words = label.split(' ');
  let letterIndex = 0;

  return (
    <span
      ref={(el) => {
        selfRef.current = el;
        if (typeof ref === 'function') {
          ref(el);
        } else if (ref) {
          (ref as { current: HTMLSpanElement | null }).current = el;
        }
      }}
      className={`${robotoFlex.className} variable-proximity ${className}`}
      onClick={onClick}
      style={{ display: 'inline', ...style }}
      {...restProps}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-block' }}>
          {word.split('').map((letter) => {
            const idx = letterIndex++;
            return (
              <span
                key={idx}
                ref={(el) => {
                  letterRefs.current[idx] = el;
                }}
                style={{
                  display: 'inline-block',
                  fontVariationSettings: fromFontVariationSettings,
                }}
                aria-hidden="true"
              >
                {letter}
              </span>
            );
          })}
          {wordIndex < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

VariableProximity.displayName = 'VariableProximity';
export default VariableProximity;
