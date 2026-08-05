import { transliterateUzbek, type Lang } from "@/i18n";

export const local = (
  value: string | Partial<Record<Lang, string>>,
  lang: Lang,
): string => {
  if (typeof value === "string") {
    return lang === "uzl" ? transliterateUzbek(value) : value;
  }

  if (lang === "uzl") {
    return (
      value.uzl ??
      transliterateUzbek(
        value.uz ?? value.ru ?? value.en ?? value.zh ?? "",
      )
    );
  }

  return value[lang] ?? value.uz ?? value.ru ?? value.en ?? value.zh ?? "";
};
