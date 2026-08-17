import { create } from 'zustand';

interface MarqueeState {
  isReversed: boolean;
  setReversed: (value: boolean) => void;
}

export const useMarqueeStore = create<MarqueeState>((set) => ({
  isReversed: false,
  setReversed: (value: boolean) => set({ isReversed: value }),
}));
