import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Preferences {
  codeWrap: boolean;
  setCodeWrap: (value: boolean) => void;
  toggleCodeWrap: () => void;
}

export const usePreferences = create<Preferences>()(
  persist(
    (set) => ({
      codeWrap: true,
      setCodeWrap: (value) => set({ codeWrap: value }),
      toggleCodeWrap: () => set((s) => ({ codeWrap: !s.codeWrap })),
    }),
    { name: "preferences" },
  ),
);
