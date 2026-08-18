import { create } from 'zustand';

interface LaunchState {
  /** 当前加载进度 0-100 */
  progress: number;
  /** true = hero 资源加载完成，开屏开始退出、hero 入场动画开始 */
  isLoaded: boolean;
  setProgress: (p: number) => void;
  /** 置 isLoaded=true 且 progress=100 */
  setLoaded: () => void;
}

export const useLaunchStore = create<LaunchState>((set) => ({
  progress: 0,
  isLoaded: false,
  setProgress: (p) => set({ progress: p }),
  setLoaded: () => set({ isLoaded: true, progress: 100 }),
}));
