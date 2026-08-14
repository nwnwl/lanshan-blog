import { create } from 'zustand';

type Phase = 'idle' | 'in' | 'out';

interface TransitionState {
  phase: Phase;
  navigate: (href: string, push: (href: string) => void) => void;
}

export const useTransitionStore = create<TransitionState>((set) => ({
  phase: 'idle',

  navigate: (href: string, push: (href: string) => void) => {
    set({ phase: 'in' });
    // 0.25s 后遮罩完全覆盖：先复位滚动，避免 body 滚动位置跨页残留，再切换路由
    setTimeout(() => {
      window.scrollTo(0, 0);
      push(href);
    }, 250);
    // 1.75s 后开始滑出
    setTimeout(() => set({ phase: 'out' }), 1750);
    // 2s 后动画结束，移除遮罩
    setTimeout(() => set({ phase: 'idle' }), 2000);
  },
}));
