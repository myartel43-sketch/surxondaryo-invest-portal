import { useLayoutEffect } from "react";
import {
  transliterateUzbek,
  useI18n,
  type Lang,
} from "@/i18n";

type TranslationSet = {
  ru: string;
  en: string;
  zh: string;
};

const TEXT: Record<string, TranslationSet> = {
  "Бош саҳифа": { ru: "Главная", en: "Home", zh: "首页" },
  "Бошқарма": { ru: "Управление", en: "Department", zh: "管理局" },
  "Раҳбарият": { ru: "Руководство", en: "Management", zh: "管理层" },
  "Ходимлар": { ru: "Сотрудники", en: "Staff", zh: "员工" },
  "Ҳужжатлар": { ru: "Документы", en: "Documents", zh: "文件" },
  "Инвестиция": { ru: "Инвестиции", en: "Investment", zh: "投资" },
  "Инвестиция лойиҳалари": { ru: "Инвестиционные проекты", en: "Investment projects", zh: "投资项目" },
  "Ер майдонлари": { ru: "Земельные участки", en: "Land plots", zh: "土地" },
  "Интерактив харита": { ru: "Интерактивная карта", en: "Interactive map", zh: "互动地图" },
  "Саноат": { ru: "Промышленность", en: "Industry", zh: "工业" },
  "Ташқи савдо ва экспорт": { ru: "Внешняя торговля и экспорт", en: "Foreign trade and export", zh: "外贸与出口" },
  "Тадбиркорларга хизматлар": { ru: "Услуги предпринимателям", en: "Business services", zh: "企业服务" },
  "Ахборот": { ru: "Информация", en: "Information", zh: "信息" },
  "Янгиликлар": { ru: "Новости", en: "News", zh: "新闻" },
  "Медиа": { ru: "Медиа", en: "Media", zh: "媒体" },
  "Боғланиш": { ru: "Контакты", en: "Contacts", zh: "联系方式" },
  "Онлайн қабулхона": { ru: "Онлайн-приёмная", en: "Online reception", zh: "在线接待" },
  "Шахсий кабинет": { ru: "Личный кабинет", en: "Personal account", zh: "个人中心" },
  "Кўзи ожизлар учун": { ru: "Для слабовидящих", en: "For visually impaired", zh: "无障碍模式" },
  "Расмий давлат портали": { ru: "Официальный государственный портал", en: "Official government portal", zh: "官方政府门户" },
  "Барча имкониятлар": { ru: "Все возможности", en: "All opportunities", zh: "所有机会" },
  "Интерактив харитани очиш": { ru: "Открыть интерактивную карту", en: "Open interactive map", zh: "打开互动地图" },
  "Сўнгги янгиликлар": { ru: "Последние новости", en: "Latest news", zh: "最新消息" },
  "Барча янгиликлар": { ru: "Все новости", en: "All news", zh: "所有新闻" },
  "Устувор лойиҳа": { ru: "Приоритетный проект", en: "Featured project", zh: "重点项目" },
  "Қиймати": { ru: "Стоимость", en: "Value", zh: "投资额" },
  "Ҳолати": { ru: "Статус", en: "Status", zh: "状态" },
  "Майдон": { ru: "Площадь", en: "Area", zh: "面积" },
  "Лойиҳалар каталогини очиш": { ru: "Открыть каталог проектов", en: "Open project catalogue", zh: "打开项目目录" },
  "Бўлимлар": { ru: "Разделы", en: "Sections", zh: "栏目" },
  "Фойдали ҳаволалар": { ru: "Полезные ссылки", en: "Useful links", zh: "实用链接" },
  "Алоқа": { ru: "Контакты", en: "Contacts", zh: "联系方式" },
  "Юклаб олиш": { ru: "Скачать", en: "Download", zh: "下载" },
  "Файлни очиш": { ru: "Открыть файл", en: "Open file", zh: "打开文件" },
  "Кўриш": { ru: "Открыть", en: "View", zh: "查看" },
  "Қидириш": { ru: "Поиск", en: "Search", zh: "搜索" },
};

const ORIGINAL_TEXT = new WeakMap<Node, string>();
const ORIGINAL_ATTR =
  new WeakMap<Element, Record<string, string>>();

const orderedEntries = Object.entries(TEXT).sort(
  ([a], [b]) => b.length - a.length,
);

function translate(value: string, lang: Lang): string {
  if (!value.trim() || lang === "uz") return value;

  if (lang === "uzl") {
    return transliterateUzbek(value);
  }

  let result = value;

  for (const [source, translations] of orderedEntries) {
    const replacement =
      translations[lang as "ru" | "en" | "zh"];

    if (replacement && result.includes(source)) {
      result = result.split(source).join(replacement);
    }
  }

  return result;
}

function process(root: ParentNode, lang: Lang) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;

        if (!parent) {
          return NodeFilter.FILTER_REJECT;
        }

        if (
          parent.closest(
            "script, style, code, pre, [data-no-runtime-translate], input, textarea, select, option",
          )
        ) {
          return NodeFilter.FILTER_REJECT;
        }

        return node.textContent?.trim()
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    },
  );

  let node: Node | null;

  while ((node = walker.nextNode())) {
    if (!ORIGINAL_TEXT.has(node)) {
      ORIGINAL_TEXT.set(
        node,
        node.textContent || "",
      );
    }

    const original =
      ORIGINAL_TEXT.get(node) || "";
    node.textContent = translate(original, lang);
  }

  root
    .querySelectorAll<HTMLElement>(
      "[placeholder], [title], [aria-label]",
    )
    .forEach((element) => {
      if (!ORIGINAL_ATTR.has(element)) {
        const values: Record<string, string> = {};

        [
          "placeholder",
          "title",
          "aria-label",
        ].forEach((attribute) => {
          const current =
            element.getAttribute(attribute);

          if (current) {
            values[attribute] = current;
          }
        });

        ORIGINAL_ATTR.set(element, values);
      }

      const originals =
        ORIGINAL_ATTR.get(element) || {};

      Object.entries(originals).forEach(
        ([attribute, value]) => {
          element.setAttribute(
            attribute,
            translate(value, lang),
          );
        },
      );
    });
}

export function RuntimeTranslator() {
  const { lang } = useI18n();

  useLayoutEffect(() => {
    const html = document.documentElement;
    html.classList.add("language-updating");

    process(document.body, lang);

    requestAnimationFrame(() => {
      html.classList.remove("language-updating");
    });

    const observer = new MutationObserver(
      (mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (
              node.nodeType === Node.ELEMENT_NODE
            ) {
              process(node as Element, lang);
            } else if (
              node.nodeType === Node.TEXT_NODE &&
              node.parentNode
            ) {
              process(node.parentNode, lang);
            }
          }
        }
      },
    );

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      html.classList.remove("language-updating");
    };
  }, [lang]);

  return null;
}
