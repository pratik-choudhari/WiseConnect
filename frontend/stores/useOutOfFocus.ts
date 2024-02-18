import { create } from "zustand";

interface OutOfFocusState {
  outOfFocus: boolean;
  setOutOfFocus: (outOfFocus: boolean) => void;
}

export const useOutOfFocus = create<OutOfFocusState>()((set) => ({
  outOfFocus: false,
  setOutOfFocus: (outOfFocus) => set(() => ({ outOfFocus })),
}));
