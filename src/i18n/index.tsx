import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  LANGS as BASE_LANGS,
  LANG_META as BASE_LANG_META,
  translations,
  type Lang as BaseLang,
} from "./translations";

export type Lang = BaseLang | "uzl";

export const LANGS = [...BASE_LANGS, "uzl"] as const;

export const LANG_META: Record<
  Lang,
  { label: string; short: string; htmlLang: string }
> = {
  ...BASE_LANG_META,
  uzl: {
    label: "O‘zbekcha (lotin)",
    short: "O‘Z",
    htmlLang: "uz-Latn",
  },
};

const STORAGE_KEY = "sid.lang";
const DEFAULT_LANG: Lang = "uz";

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  tr: (value: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

const CYRILLIC_TO_LATIN: Array<[RegExp, string]> = [
  [/Ё/g, "Yo"], [/ё/g, "yo"],
  [/Ж/g, "J"], [/ж/g, "j"],
  [/Ч/g, "Ch"], [/ч/g, "ch"],
  [/Ш/g, "Sh"], [/ш/g, "sh"],
  [/Щ/g, "Sh"], [/щ/g, "sh"],
  [/Ю/g, "Yu"], [/ю/g, "yu"],
  [/Я/g, "Ya"], [/я/g, "ya"],
  [/Ғ/g, "G‘"], [/ғ/g, "g‘"],
  [/Қ/g, "Q"], [/қ/g, "q"],
  [/Ў/g, "O‘"], [/ў/g, "o‘"],
  [/Ҳ/g, "H"], [/ҳ/g, "h"],
  [/Ц/g, "S"], [/ц/g, "s"],
  [/Ъ/g, "’"], [/ъ/g, "’"],
  [/Ь/g, ""], [/ь/g, ""],
  [/А/g, "A"], [/а/g, "a"],
  [/Б/g, "B"], [/б/g, "b"],
  [/В/g, "V"], [/в/g, "v"],
  [/Г/g, "G"], [/г/g, "g"],
  [/Д/g, "D"], [/д/g, "d"],
  [/Е/g, "E"], [/е/g, "e"],
  [/З/g, "Z"], [/з/g, "z"],
  [/И/g, "I"], [/и/g, "i"],
  [/Й/g, "Y"], [/й/g, "y"],
  [/К/g, "K"], [/к/g, "k"],
  [/Л/g, "L"], [/л/g, "l"],
  [/М/g, "M"], [/м/g, "m"],
  [/Н/g, "N"], [/н/g, "n"],
  [/О/g, "O"], [/о/g, "o"],
  [/П/g, "P"], [/п/g, "p"],
  [/Р/g, "R"], [/р/g, "r"],
  [/С/g, "S"], [/с/g, "s"],
  [/Т/g, "T"], [/т/g, "t"],
  [/У/g, "U"], [/у/g, "u"],
  [/Ф/g, "F"], [/ф/g, "f"],
  [/Х/g, "X"], [/х/g, "x"],
  [/Э/g, "E"], [/э/g, "e"],
];

export function transliterateUzbek(value: string): string {
  return CYRILLIC_TO_LATIN.reduce(
    (result, [pattern, replacement]) =>
      result.replace(pattern, replacement),
    value,
  );
}

function readInitialLanguage(): Lang {
  if (typeof window === "undefined") return DEFAULT_LANG;

  try {
    const stored = window.localStorage.getItem(
      STORAGE_KEY,
    ) as Lang | null;

    if (
      stored &&
      (LANGS as readonly string[]).includes(stored)
    ) {
      return stored;
    }
  } catch {
    // localStorage may be unavailable.
  }

  return DEFAULT_LANG;
}

export function I18nProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [lang, setLangState] =
    useState<Lang>(readInitialLanguage);

  useLayoutEffect(() => {
    document.documentElement.lang =
      LANG_META[lang].htmlLang;
    document.documentElement.dataset.language = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    document.documentElement.dataset.language = next;
    setLangState(next);

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage may be unavailable.
    }
  }, []);

  const tr = useCallback(
    (value: string) =>
      lang === "uzl"
        ? transliterateUzbek(value)
        : value,
    [lang],
  );

  const t = useCallback(
    (key: string) => {
      if (lang === "uzl") {
        return transliterateUzbek(
          translations.uz[key] ??
            translations.ru[key] ??
            translations.en[key] ??
            key,
        );
      }

      return (
        translations[lang][key] ??
        translations.uz[key] ??
        translations.en[key] ??
        key
      );
    },
    [lang],
  );

  const value = useMemo(
    () => ({ lang, setLang, t, tr }),
    [lang, setLang, t, tr],
  );

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error(
      "useI18n must be used inside I18nProvider",
    );
  }

  return context;
}

export function pickLocale(
  value: Partial<Record<Lang, string>> | undefined,
  lang: Lang,
): string {
  if (!value) return "";

  if (lang === "uzl") {
    return (
      value.uzl ??
      transliterateUzbek(
        value.uz ??
          value.ru ??
          value.en ??
          value.zh ??
          "",
      )
    );
  }

  return (
    value[lang] ??
    value.uz ??
    value.en ??
    value.ru ??
    ""
  );
}
