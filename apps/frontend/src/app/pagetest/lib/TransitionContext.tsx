'use client';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type Phase = 'idle' | 'in' | 'out';

interface TransitionCtx {
  navigate: (href: string) => void;
  phase: Phase;
}

const ctx = createContext<TransitionCtx>({ navigate: () => {}, phase: 'idle' });
export const useTransition = () => useContext(ctx);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('idle');

  const navigate = useCallback(
    (href: string) => {
      setPhase('in');
      // 0.5s 后遮罩完全覆盖，切换路由
      setTimeout(() => {
        router.push(href);
      }, 500);
      // 2.5s 后开始滑出（中间留 2s 给 Lottie）
      setTimeout(() => setPhase('out'), 2500);
      // 3s 后动画结束，移除遮罩
      setTimeout(() => setPhase('idle'), 3000);
    },
    [router],
  );

  return <ctx.Provider value={{ navigate, phase }}>{children}</ctx.Provider>;
}
