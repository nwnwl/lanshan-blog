'use client';
import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface TransitionCtx {
  navigate: (href: string) => void;
  showOverlay: boolean;
}

const ctx = createContext<TransitionCtx>({ navigate: () => {}, showOverlay: false });
export const useTransition = () => useContext(ctx);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);
  const pendingRef = useRef<string | null>(null);

  const navigate = useCallback(
    (href: string) => {
      pendingRef.current = href;
      setShowOverlay(true); // 遮罩滑入
      // 等遮罩动画结束后再跳转
      setTimeout(() => {
        router.push(href);
        // 给新页面一点渲染时间，然后滑出遮罩
        setTimeout(() => setShowOverlay(false), 100);
      }, 500);
    },
    [router],
  );

  return <ctx.Provider value={{ navigate, showOverlay }}>{children}</ctx.Provider>;
}
