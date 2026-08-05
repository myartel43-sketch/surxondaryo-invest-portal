import { useEffect } from "react";
import { transliterateUzbek, useI18n, type Lang } from "@/i18n";

type TranslationSet = {
  ru: string;
  en: string;
  zh: string;
};

const TEXT: Record<string, TranslationSet> = {
  "Бошқарув панели": {
    ru: "Панель управления",
    en: "Administration panel",
    zh: "管理面板",
  },
  "Барча админ бўлимлари бир жойда": {
    ru: "Все административные разделы в одном месте",
    en: "All administration sections in one place",
    zh: "所有管理模块集中在一个位置",
  },
  "Сайтни кўриш": {
    ru: "Открыть сайт",
    en: "View website",
    zh: "查看网站",
  },
  "Хуш келибсиз": {
    ru: "Добро пожаловать",
    en: "Welcome",
    zh: "欢迎",
  },
  "Ягона администратор панели": {
    ru: "Единая панель администратора",
    en: "Unified administration panel",
    zh: "统一管理面板",
  },
  "Жами кўришлар": {
    ru: "Всего просмотров",
    en: "Total views",
    zh: "总浏览量",
  },
  "Янгиликлар": {
    ru: "Новости",
    en: "News",
    zh: "新闻",
  },
  "Лойиҳалар": {
    ru: "Проекты",
    en: "Projects",
    zh: "项目",
  },
  "Тиллар": {
    ru: "Языки",
    en: "Languages",
    zh: "语言",
  },
  "Барча бошқарув бўлимлари": {
    ru: "Все разделы управления",
    en: "All management sections",
    zh: "所有管理模块",
  },
  "Инвестиция лойиҳалари": {
    ru: "Инвестиционные проекты",
    en: "Investment projects",
    zh: "投资项目",
  },
  "Ходимлар": {
    ru: "Сотрудники",
    en: "Staff",
    zh: "员工",
  },
  "Ҳужжатлар": {
    ru: "Документы",
    en: "Documents",
    zh: "文件",
  },
  "Медиа": {
    ru: "Медиа",
    en: "Media",
    zh: "媒体",
  },
  "Ер майдонлари ва харита": {
    ru: "Земельные участки и карта",
    en: "Land plots and map",
    zh: "地块与地图",
  },
  "Чизиш, таҳрирлаш ва площадь ҳисоблаш": {
    ru: "Рисование, редактирование и расчёт площади",
    en: "Drawing, editing and area calculation",
    zh: "绘制、编辑和面积计算",
  },
  "Харитани очиш": {
    ru: "Открыть карту",
    en: "Open map",
    zh: "打开地图",
  },
  "Ҳаволалар ва иконкалар": {
    ru: "Ссылки и иконки",
    en: "Links and icons",
    zh: "链接和图标",
  },
  "Футер ва ижтимоий тармоқ манзиллари": {
    ru: "Ссылки футера и социальных сетей",
    en: "Footer and social media links",
    zh: "页脚和社交媒体链接",
  },
  "Сақлаш": {
    ru: "Сохранить",
    en: "Save",
    zh: "保存",
  },
  "Сақланмоқда...": {
    ru: "Сохранение...",
    en: "Saving...",
    zh: "正在保存...",
  },
  "Фойдали ҳаволалар": {
    ru: "Полезные ссылки",
    en: "Useful links",
    zh: "实用链接",
  },
  "Янги ҳавола": {
    ru: "Новая ссылка",
    en: "New link",
    zh: "新链接",
  },
  "Ўчириш": {
    ru: "Удалить",
    en: "Delete",
    zh: "删除",
  },
  "Қўшиш": {
    ru: "Добавить",
    en: "Add",
    zh: "添加",
  },
  "Янгиликларни қўшиш ва таҳрирлаш": {
    ru: "Добавление и редактирование новостей",
    en: "Add and edit news",
    zh: "添加和编辑新闻",
  },
  "Лойиҳалар каталоги": {
    ru: "Каталог проектов",
    en: "Project catalogue",
    zh: "项目目录",
  },
  "Раҳбарият ва ходимлар": {
    ru: "Руководство и сотрудники",
    en: "Management and staff",
    zh: "管理层和员工",
  },
  "PDF, DOCX ва бошқа файллар": {
    ru: "PDF, DOCX и другие файлы",
    en: "PDF, DOCX and other files",
    zh: "PDF、DOCX 和其他文件",
  },
  "Фото ва видеолар": {
    ru: "Фото и видео",
    en: "Photos and videos",
    zh: "照片和视频",
  },
  "Лойиҳа, соҳа ёки туман бўйича қидириш": {
    ru: "Поиск по проекту, отрасли или району",
    en: "Search by project, sector or district",
    zh: "按项目、行业或地区搜索",
  },
  "Ходим ёки бўлим бўйича қидириш": {
    ru: "Поиск по сотруднику или отделу",
    en: "Search by employee or department",
    zh: "按员工或部门搜索",
  },
  "Ҳужжат номи бўйича қидириш": {
    ru: "Поиск по названию документа",
    en: "Search by document title",
    zh: "按文件标题搜索",
  },
  "Қиймати": {
    ru: "Стоимость",
    en: "Value",
    zh: "投资额",
  },
  "Иш ўрни": {
    ru: "Рабочие места",
    en: "Jobs",
    zh: "就业岗位",
  },
  "Ҳудуд": {
    ru: "Территория",
    en: "Location",
    zh: "地区",
  },
  "Ҳолати": {
    ru: "Статус",
    en: "Status",
    zh: "状态",
  },
  "Майдон": {
    ru: "Площадь",
    en: "Area",
    zh: "面积",
  },
  "Электр": {
    ru: "Электричество",
    en: "Electricity",
    zh: "电力",
  },
  "Газ": {
    ru: "Газ",
    en: "Gas",
    zh: "天然气",
  },
  "Сув": {
    ru: "Вода",
    en: "Water",
    zh: "供水",
  },
  "Харитада кўриш": {
    ru: "Посмотреть на карте",
    en: "View on map",
    zh: "在地图上查看",
  },
  "Харитада очиш →": {
    ru: "Открыть на карте →",
    en: "Open on map →",
    zh: "在地图上打开 →",
  },
  "Юклаб олиш": {
    ru: "Скачать",
    en: "Download",
    zh: "下载",
  },
  "Кўриш →": {
    ru: "Посмотреть →",
    en: "View →",
    zh: "查看 →",
  },
  "Фото ва видео материаллар": {
    ru: "Фото- и видеоматериалы",
    en: "Photo and video materials",
    zh: "图片和视频资料",
  },
  "Инвестиция таклифлари": {
    ru: "Инвестиционные предложения",
    en: "Investment proposals",
    zh: "投资建议",
  },
  "Инвесторларга ҳамроҳлик": {
    ru: "Сопровождение инвесторов",
    en: "Investor support",
    zh: "投资者服务",
  },
  "Имтиёз ва преференциялар": {
    ru: "Льготы и преференции",
    en: "Benefits and preferences",
    zh: "优惠与政策支持",
  },
  "Енгил саноат": {
    ru: "Лёгкая промышленность",
    en: "Light industry",
    zh: "轻工业",
  },
  "Қурилиш материаллари": {
    ru: "Строительные материалы",
    en: "Construction materials",
    zh: "建筑材料",
  },
  "Озиқ-овқат саноати": {
    ru: "Пищевая промышленность",
    en: "Food industry",
    zh: "食品工业",
  },
  "Ер ва инфратузилма": {
    ru: "Земля и инфраструктура",
    en: "Land and infrastructure",
    zh: "土地与基础设施",
  },
  "Экспортга кўмак": {
    ru: "Поддержка экспорта",
    en: "Export support",
    zh: "出口支持",
  },
  "Лойиҳа ҳужжатлари": {
    ru: "Проектная документация",
    en: "Project documentation",
    zh: "项目文件",
  },
  "AI ёрдамчи": {
    ru: "AI-помощник",
    en: "AI assistant",
    zh: "AI 助手",
  },
  "Матн тайёрлаш, таржима қилиш ва таҳрирлаш": {
    ru: "Подготовка, перевод и редактирование текста",
    en: "Draft, translate and edit content",
    zh: "撰写、翻译和编辑内容",
  },
};

const ORIGINAL_TEXT = new WeakMap<Node, string>();
const ORIGINAL_ATTR = new WeakMap<Element, Record<string, string>>();

function translate(value: string, lang: Lang): string {
  const trimmed = value.trim();
  if (!trimmed) return value;

  if (lang === "uz") return value;
  if (lang === "uzl") {
    return value.replace(trimmed, transliterateUzbek(trimmed));
  }

  const entry = TEXT[trimmed];
  if (!entry || !(lang in entry)) return value;
  return value.replace(trimmed, entry[lang as "ru" | "en" | "zh"]);
}

function process(root: ParentNode, lang: Lang) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (
          parent.closest(
            "script, style, code, pre, [data-no-runtime-translate], input, textarea",
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
      ORIGINAL_TEXT.set(node, node.textContent || "");
    }
    const original = ORIGINAL_TEXT.get(node) || "";
    node.textContent = translate(original, lang);
  }

  root
    .querySelectorAll<HTMLElement>(
      "[placeholder], [title], [aria-label]",
    )
    .forEach((element) => {
      if (!ORIGINAL_ATTR.has(element)) {
        const values: Record<string, string> = {};
        ["placeholder", "title", "aria-label"].forEach((attribute) => {
          const current = element.getAttribute(attribute);
          if (current) values[attribute] = current;
        });
        ORIGINAL_ATTR.set(element, values);
      }

      const originals = ORIGINAL_ATTR.get(element) || {};
      Object.entries(originals).forEach(([attribute, value]) => {
        element.setAttribute(attribute, translate(value, lang));
      });
    });
}

export function RuntimeTranslator() {
  const { lang } = useI18n();

  useEffect(() => {
    process(document.body, lang);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            process(node as Element, lang);
          } else if (node.nodeType === Node.TEXT_NODE && node.parentNode) {
            process(node.parentNode, lang);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [lang]);

  return null;
}
