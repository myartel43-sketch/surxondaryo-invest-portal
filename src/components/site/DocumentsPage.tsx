import { useEffect, useMemo, useState } from "react";
import { Download, ExternalLink, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { listDocuments, localized, type DocumentItem } from "@/lib/extra-content-api";
import { useI18n, transliterateUzbek } from "@/i18n";

const labels = {
  search: { uz: "Ҳужжат номи бўйича қидириш", ru: "Поиск по названию документа", en: "Search documents by title", zh: "按文件标题搜索" },
  open: { uz: "Файлни очиш", ru: "Открыть файл", en: "Open file", zh: "打开文件" },
  download: { uz: "Юклаб олиш", ru: "Скачать", en: "Download", zh: "下载" },
  empty: { uz: "Ҳозирча ҳужжат қўшилмаган.", ru: "Документы пока не добавлены.", en: "No documents have been added yet.", zh: "尚未添加文件。" },
};

export function DocumentsPage() {
  const { lang } = useI18n();
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    listDocuments(true).then(setItems).catch(() => setItems([]));
  }, []);

  const tr = (value: Record<string, string>) =>
    lang === "uzl" ? transliterateUzbek(value.uz) : value[lang] ?? value.uz;

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    return items.filter((item) => localized(item, "title", lang).toLowerCase().includes(value));
  }, [items, query, lang]);

  return (
    <>
      <div className="relative max-w-lg">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={tr(labels.search)}
          className="h-12 rounded-xl pl-11"
        />
      </div>

      <div className="mt-8 space-y-4">
        {filtered.length ? filtered.map((item) => (
          <article key={item.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700">
              <FileText className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-slate-950">{localized(item, "title", lang)}</h2>
              <p className="mt-1 text-sm text-slate-500">{item.file_type} · {item.document_date}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={item.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-extrabold text-white"
              >
                <ExternalLink className="size-4" />
                {tr(labels.open)}
              </a>
              <a
                href={item.file_url}
                download
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-extrabold text-slate-700"
              >
                <Download className="size-4" />
                {tr(labels.download)}
              </a>
            </div>
          </article>
        )) : (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            {tr(labels.empty)}
          </p>
        )}
      </div>
    </>
  );
}
