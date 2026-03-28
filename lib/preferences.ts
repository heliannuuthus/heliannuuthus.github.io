import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Preferences {
  codeWrap: boolean;
  codeFontSize: number;
  articleFontSize: number;
  lineNumbers: boolean;
  tocVisible: boolean;

  setCodeWrap: (value: boolean) => void;
  toggleCodeWrap: () => void;
  setCodeFontSize: (value: number) => void;
  setArticleFontSize: (value: number) => void;
  setLineNumbers: (value: boolean) => void;
  toggleLineNumbers: () => void;
  setTocVisible: (value: boolean) => void;
  toggleTocVisible: () => void;
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export const usePreferences = create<Preferences>()(
  persist(
    (set) => ({
      codeWrap: true,
      codeFontSize: 14,
      articleFontSize: 16,
      lineNumbers: false,
      tocVisible: true,

      setCodeWrap: (value) => set({ codeWrap: value }),
      toggleCodeWrap: () => set((s) => ({ codeWrap: !s.codeWrap })),
      setCodeFontSize: (value) => set({ codeFontSize: clamp(value, 12, 20) }),
      setArticleFontSize: (value) =>
        set({ articleFontSize: clamp(value, 14, 22) }),
      setLineNumbers: (value) => set({ lineNumbers: value }),
      toggleLineNumbers: () => set((s) => ({ lineNumbers: !s.lineNumbers })),
      setTocVisible: (value) => set({ tocVisible: value }),
      toggleTocVisible: () => set((s) => ({ tocVisible: !s.tocVisible })),
    }),
    { name: "preferences" },
  ),
);
