import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Mail, Phone, Search, UserRound } from "lucide-react";
import { PageHero, SiteLayout } from "@/components/layout/SiteLayout";
import { Input } from "@/components/ui/input";
import {
  listStaff,
  localized,
  type StaffItem,
} from "@/lib/extra-content-api";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/leadership")({
  component: LeadershipPage,
});

const fallbackStaff = [
  {
    id: "fallback-director",
    name_uz: "Бошқарма бошлиғи",
    name_ru: "Начальник управления",
    name_en: "Head of Department",
    name_zh: "部门负责人",
    role_uz: "Раҳбарият",
    role_ru: "Руководство",
    role_en: "Management",
    role_zh: "管理层",
    phone: "+998 (76) 224-14-15",
    email: "info@surxondaryo-invest.uz",
    image_url: "",
    sort_order: 0,
    is_published: true,
  },
] as StaffItem[];

function LeadershipPage() {
  const { lang, t } = useI18n();
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listStaff(true)
      .then((items) => setStaff(items))
      .catch(() => setStaff([]))
      .finally(() => setLoading(false));
  }, []);

  const source = staff.length ? staff : fallbackStaff;

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();

    return source.filter((item) => {
      const name = localized(item, "name", lang);
      const role = localized(item, "role", lang);
      return `${name} ${role}`.toLowerCase().includes(value);
    });
  }, [source, query, lang]);

  const subtitle =
    lang === "ru"
      ? "Руководство управления, должности и контактные данные."
      : lang === "en"
        ? "Department management, positions and contact details."
        : lang === "zh"
          ? "管理层、职务和联系方式。"
          : "Бошқарма раҳбарияти, лавозимлар ва алоқа маълумотлари.";

  const searchPlaceholder =
    lang === "ru"
      ? "Поиск по имени или должности"
      : lang === "en"
        ? "Search by name or position"
        : lang === "zh"
          ? "按姓名或职位搜索"
          : "Ф.И.Ш. ёки лавозим бўйича қидириш";

  return (
    <SiteLayout>
      <PageHero title={t("nav.leadership")} subtitle={subtitle} />

      <section className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="pl-10"
          />
        </div>

        {loading ? (
          <p className="mt-8 text-sm font-semibold text-muted-foreground">
            {lang === "ru"
              ? "Загрузка..."
              : lang === "en"
                ? "Loading..."
                : lang === "zh"
                  ? "加载中..."
                  : "Юкланмоқда..."}
          </p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((person, index) => {
              const name = localized(person, "name", lang);
              const role = localized(person, "role", lang);

              return (
                <article
                  key={person.id}
                  className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    {person.image_url ? (
                      <img
                        src={person.image_url}
                        alt={name}
                        className="h-full w-full object-cover object-top"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-[linear-gradient(135deg,#e7f0fb,#f4f7fb)] text-primary">
                        <div className="text-center">
                          <span className="mx-auto grid size-20 place-items-center rounded-full bg-white shadow-sm">
                            <UserRound className="size-9" />
                          </span>
                          <p className="mt-3 text-sm font-bold">
                            {index + 1}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-green">
                      {role}
                    </p>
                    <h2 className="mt-2 text-xl font-extrabold text-foreground">
                      {name}
                    </h2>

                    {person.phone && (
                      <a
                        href={`tel:${person.phone.replace(/[^\d+]/g, "")}`}
                        className="mt-5 flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
                      >
                        <Phone className="size-4 shrink-0" />
                        {person.phone}
                      </a>
                    )}

                    {person.email && (
                      <a
                        href={`mailto:${person.email}`}
                        className="mt-3 flex items-center gap-2 break-all text-sm text-muted-foreground transition hover:text-primary"
                      >
                        <Mail className="size-4 shrink-0" />
                        {person.email}
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
