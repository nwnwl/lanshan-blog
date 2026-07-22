import { create } from 'zustand';

interface MarqueeState {
  isReversed: boolean;
  toggleReverse: () => void;
  setReversed: (value: boolean) => void;
}

export const useMarqueeStore = create<MarqueeState>((set) => ({
  isReversed: false,
  toggleReverse: () => set((state) => ({ isReversed: !state.isReversed })),
  setReversed: (value: boolean) => set({ isReversed: value }),
}));
