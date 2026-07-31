import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { LANGS, LANG_META, translations, type Lang } from "./translations";

export { LANGS, LANG_META };
export type { Lang };

const STORAGE_KEY = "sid.lang";
const DEFAULT_LANG: Lang = "uz";

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && (LANGS as readonly string[]).includes(stored)) setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = LANG_META[lang].htmlLang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const t = useCallback(
    (key: string) => translations[lang][key] ?? translations[DEFAULT_LANG][key] ?? key,
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

/** Pick a localized value out of a multilingual record, with fallbacks. */
export function pickLocale(
  value: Partial<Record<Lang, string>> | undefined,
  lang: Lang,
): string {
  if (!value) return "";
  return value[lang] ?? value[DEFAULT_LANG] ?? value.en ?? value.ru ?? "";
}
