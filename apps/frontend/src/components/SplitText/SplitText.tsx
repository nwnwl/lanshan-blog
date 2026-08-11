'use client';

import { useRef, useEffect, useState } from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  tag?: string;
  threshold?: number;
}

const SplitText = ({
  text,
  className = '',
  delay = 30,
  tag = 'p',
  threshold = 0,
}: SplitTextProps) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const lines = text.split('\n');

  const Tag = tag as any;

  return (
    <Tag
      ref={ref}
      className={`split-parent ${className}`}
      style={{
        overflow: 'hidden',
        display: 'inline-block',
      }}
    >
      {lines.map((line, li) => (
        <span key={li} style={{ display: 'contents' }}>
          {line.split('').map((char, ci) => (
            <span
              key={ci}
              className="split-char"
              style={{
                display: 'inline-block',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
                transitionDelay: visible ? `${(li * line.length + ci) * delay}ms` : '0ms',
              }}
            >
              {char === ' ' ? ' ' : char}
            </span>
          ))}
          {li < lines.length - 1 && <br />}
        </span>
      ))}
    </Tag>
  );
};

export default SplitText;
