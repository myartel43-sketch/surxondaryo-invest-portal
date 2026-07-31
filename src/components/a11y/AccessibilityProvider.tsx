import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type A11yState = {
  fontScale: number;
  contrast: boolean;
  grayscale: boolean;
  noAnimation: boolean;
  underlineLinks: boolean;
};

const DEFAULT: A11yState = {
  fontScale: 1,
  contrast: false,
  grayscale: false,
  noAnimation: false,
  underlineLinks: false,
};

const STORAGE_KEY = "sid.a11y";

type A11yValue = A11yState & {
  set: <K extends keyof A11yState>(key: K, value: A11yState[K]) => void;
  toggle: (key: Exclude<keyof A11yState, "fontScale">) => void;
  fontUp: () => void;
  fontDown: () => void;
  reset: () => void;
  isActive: boolean;
};

const A11yContext = createContext<A11yValue | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<A11yState>(DEFAULT);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...DEFAULT, ...(JSON.parse(raw) as Partial<A11yState>) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--a11y-font-scale", String(state.fontScale));
    root.classList.toggle("a11y-contrast", state.contrast);
    root.classList.toggle("a11y-grayscale", state.grayscale);
    root.classList.toggle("a11y-no-animation", state.noAnimation);
    root.classList.toggle("a11y-underline", state.underlineLinks);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const set = useCallback(
    <K extends keyof A11yState>(key: K, value: A11yState[K]) =>
      setState((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const value = useMemo<A11yValue>(
    () => ({
      ...state,
      set,
      toggle: (key) => setState((prev) => ({ ...prev, [key]: !prev[key] })),
      fontUp: () =>
        setState((prev) => ({ ...prev, fontScale: Math.min(1.6, +(prev.fontScale + 0.1).toFixed(2)) })),
      fontDown: () =>
        setState((prev) => ({ ...prev, fontScale: Math.max(0.9, +(prev.fontScale - 0.1).toFixed(2)) })),
      reset: () => setState(DEFAULT),
      isActive:
        state.fontScale !== 1 ||
        state.contrast ||
        state.grayscale ||
        state.noAnimation ||
        state.underlineLinks,
    }),
    [state, set],
  );

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

export function useA11y(): A11yValue {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11y must be used inside AccessibilityProvider");
  return ctx;
}
