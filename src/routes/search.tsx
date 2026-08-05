import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { PageHero, SiteLayout } from "@/components/layout/SiteLayout";
import { NAV } from "@/lib/site-config";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { t } = useI18n();

  const pages = useMemo(() => {
    const flattened = NAV.flatMap((item) =>
      item.children ? [item, ...item.children] : [item],
    );

    const unique = new Map<string, { to: string; title: string }>();

    flattened.forEach((item) => {
      if (!item.to || unique.has(item.to)) return;
      unique.set(item.to, {
        to: item.to,
        title: t(item.key),
      });
    });

    return Array.from(unique.values());
  }, [t]);

  const normalized = q.trim().toLocaleLowerCase();

  const results = pages.filter((page) =>
    page.title.toLocaleLowerCase().includes(normalized),
  );

  return (
    <SiteLayout>
      <PageHero
        title={t("header.search")}
        subtitle={q ? `Результаты поиска: «${q}»` : "Введите название нужного раздела сайта."}
      />

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <form className="rounded-2xl border border-border bg-card p-3 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">{t("header.search")}</span>
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <input
                name="q"
                defaultValue={q}
                autoFocus
                placeholder={t("header.search.placeholder")}
                className="h-12 w-full rounded-xl border border-input bg-background pl-12 pr-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </label>

            <button className="h-12 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition hover:opacity-90">
              {t("common.search")}
            </button>
          </div>
        </form>

        {!normalized ? (
          <p className="mt-8 rounded-2xl bg-muted p-6 text-sm text-muted-foreground">
            Начните вводить, например: инвестиции, документы, карта или контакты.
          </p>
        ) : results.length ? (
          <div className="mt-8 grid gap-4">
            {results.map((result) => (
              <Link
                key={result.to}
                to={result.to}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <div>
                  <p className="text-lg font-extrabold text-foreground">
                    {result.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {result.to}
                  </p>
                </div>
                <ArrowRight className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="font-extrabold text-foreground">
              Ничего не найдено
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Попробуйте другое название раздела.
            </p>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
