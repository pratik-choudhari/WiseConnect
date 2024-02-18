import { create } from "zustand";

interface UserIdState {
  userId: number | null;
  setUserId: (userId: number | null) => void;
}

export const useUserId = create<UserIdState>()((set) => ({
  userId: null,
  setUserId: (userId) => set(() => ({ userId })),
}));
