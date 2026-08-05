import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import {
  BarChart3,
  Bot,
  Building2,
  ExternalLink,
  FileText,
  Globe2,
  Image,
  Link2,
  MapPinned,
  Menu,
  Newspaper,
  Plus,
  Save,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AdminSidebar, type AdminModule } from "@/components/admin/AdminSidebar";
import { AIAssistant } from "@/components/admin/AIAssistant";
import { ContentManagers } from "@/components/admin/ContentManagers";
import { ExtraManagers } from "@/components/admin/ExtraManagers";
import { RuntimeTranslator } from "@/i18n/RuntimeTranslator";
import { getStoredSession, type SupabaseSession } from "@/lib/supabase-auth";
import {
  DEFAULT_SITE_SETTINGS,
  loadSiteSettings,
  saveSiteSettings,
  type SiteSettings,
} from "@/lib/site-settings";
import "@/admin-premium.css";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const modules = [
  {
    key: "news" as const,
    icon: Newspaper,
    title: "Янгиликлар",
    desc: "Янгиликларни қўшиш ва таҳрирлаш",
  },
  {
    key: "projects" as const,
    icon: Building2,
    title: "Инвестиция лойиҳалари",
    desc: "Лойиҳалар каталоги",
  },
  {
    key: "staff" as const,
    icon: Users,
    title: "Ходимлар",
    desc: "Раҳбарият ва ходимлар",
  },
  {
    key: "documents" as const,
    icon: FileText,
    title: "Ҳужжатлар",
    desc: "PDF, DOCX ва бошқа файллар",
  },
  {
    key: "media" as const,
    icon: Image,
    title: "Медиа",
    desc: "Фото ва видеолар",
  },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [settings, setSettings] =
    useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const current = getStoredSession();
    if (!current) {
      navigate({ to: "/admin/login" });
      return;
    }

    setSession(current);
    loadSiteSettings()
      .then(setSettings)
      .finally(() => setReady(true));
  }, [navigate]);

  function openModule(
    module: AdminModule,
    action: "list" | "add",
  ) {
    window.dispatchEvent(
      new CustomEvent("admin:open-module", {
        detail: { module, action },
      }),
    );
    setMenuOpen(false);
    window.setTimeout(() => {
      document
        .getElementById(
          action === "add"
            ? "extra-editor-form"
            : "extra-content",
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 80);
  }

  async function submitSettings(event: FormEvent) {
    event.preventDefault();
    if (!session) return;

    setSaving(true);
    setStatus("");

    try {
      await saveSiteSettings(settings, session);
      setStatus("Созламалар сақланди.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Сақлашда хато.",
      );
    } finally {
      setSaving(false);
    }
  }

  function updateSocial(
    key: keyof SiteSettings["socialLinks"],
    value: string,
  ) {
    setSettings((current) => ({
      ...current,
      socialLinks: {
        ...current.socialLinks,
        [key]: value,
      },
    }));
  }

  function updateUseful(
    index: number,
    field: "label" | "url",
    value: string,
  ) {
    setSettings((current) => ({
      ...current,
      usefulLinks: current.usefulLinks.map(
        (item, itemIndex) =>
          itemIndex === index
            ? { ...item, [field]: value }
            : item,
      ),
    }));
  }

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#eef2f8] font-bold text-slate-500">
        Юкланмоқда...
      </div>
    );
  }

  return (
    <main className="admin-premium min-h-screen bg-[#eef2f8]">
      <RuntimeTranslator />
      <AdminSidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        active="dashboard"
        onModule={openModule}
      />

      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 px-4 py-3 backdrop-blur-xl sm:px-7">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid size-11 place-items-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Menu className="size-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-[#111d52]">
                Бошқарув панели
              </h1>
              <p className="text-xs text-slate-500">
                Барча админ бўлимлари бир жойда
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 shadow-sm"
          >
            Сайтни кўриш
            <ExternalLink className="size-4" />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1480px] p-4 sm:p-7">
        <section className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(120deg,#111d52,#243994_58%,#087c82)] p-7 text-white shadow-[0_30px_90px_-45px_rgba(17,29,82,.85)] sm:p-9">
          <div className="absolute -right-20 -top-24 size-72 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="relative flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-sm font-bold text-cyan-200">
                Хуш келибсиз
              </p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                Ягона администратор панели
              </h2>
              <p className="mt-3 text-sm text-white/65">
                {session?.user.email}
              </p>
            </div>

            <a
              href="#ai-assistant"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-extrabold backdrop-blur transition hover:bg-white/15"
            >
              <Bot className="size-5 text-cyan-200" />
              AI ёрдамчи
            </a>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            [BarChart3, "Жами кўришлар", "—", "blue"],
            [Newspaper, "Янгиликлар", "0", "orange"],
            [Building2, "Лойиҳалар", "0", "green"],
            [Globe2, "Тиллар", "5", "purple"],
          ].map(([Icon, title, value, tone]) => (
            <article
              key={String(title)}
              className={`admin-metric admin-metric-${tone} rounded-2xl border border-white/80 bg-white p-5 shadow-sm`}
            >
              <span className="admin-metric-icon grid size-11 place-items-center rounded-xl">
                <Icon className="size-5" />
              </span>
              <p className="mt-5 text-sm font-bold text-slate-500">
                {String(title)}
              </p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {String(value)}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-indigo-600">
                Контент бошқаруви
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Барча бошқарув бўлимлари
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
              <ShieldCheck className="size-4" />
              Supabase ҳимояси
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map(
              ({ key, icon: Icon, title, desc }, index) => (
                <article
                  key={key}
                  className="admin-module-card group rounded-[24px] border border-white/80 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid size-13 place-items-center rounded-2xl bg-indigo-50 text-indigo-700 transition group-hover:bg-indigo-700 group-hover:text-white">
                      <Icon className="size-6" />
                    </span>
                    <span className="text-4xl font-black text-slate-100">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-black text-slate-950">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {desc}
                  </p>
                  <button
                    type="button"
                    onClick={() => openModule(key, "add")}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#111d52] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-indigo-800"
                  >
                    <Plus className="size-4" />
                    Қўшиш
                  </button>
                </article>
              ),
            )}

            <Link
              to="/admin/map"
              className="admin-module-card group rounded-[24px] border border-emerald-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-13 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
                  <MapPinned className="size-6" />
                </span>
                <span className="text-4xl font-black text-slate-100">
                  06
                </span>
              </div>
              <h3 className="mt-6 text-lg font-black text-slate-950">
                Ер майдонлари ва харита
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Чизиш, таҳрирлаш ва площадь ҳисоблаш
              </p>
              <span className="mt-5 inline-flex rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-extrabold text-white">
                Харитани очиш
              </span>
            </Link>
          </div>
        </section>

        {session && (
          <div className="mt-8">
            <AIAssistant session={session} />
          </div>
        )}

        {session && <ContentManagers session={session} />}
        {session && <ExtraManagers session={session} />}

        <form
          id="links"
          onSubmit={submitSettings}
          className="mt-8 rounded-[28px] border border-white/80 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-black text-slate-950">
                <Link2 className="text-indigo-700" />
                Ҳаволалар ва иконкалар
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Футер ва ижтимоий тармоқ манзиллари
              </p>
            </div>

            <button
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 text-sm font-extrabold text-white disabled:opacity-60"
            >
              <Save className="size-4" />
              {saving ? "Сақланмоқда..." : "Сақлаш"}
            </button>
          </div>

          {status && (
            <p className="mt-5 rounded-xl bg-indigo-50 p-4 text-sm font-semibold text-indigo-800">
              {status}
            </p>
          )}

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {Object.entries(settings.socialLinks).map(
              ([key, value]) => (
                <label
                  key={key}
                  className="text-sm font-bold capitalize text-slate-700"
                >
                  {key}
                  <input
                    value={value}
                    onChange={(event) =>
                      updateSocial(
                        key as keyof SiteSettings["socialLinks"],
                        event.target.value,
                      )
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </label>
              ),
            )}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-950">
              Фойдали ҳаволалар
            </h3>
            <button
              type="button"
              onClick={() =>
                setSettings((current) => ({
                  ...current,
                  usefulLinks: [
                    ...current.usefulLinks,
                    {
                      label: "Янги ҳавола",
                      url: "https://",
                    },
                  ],
                }))
              }
              className="rounded-xl border border-indigo-200 px-4 py-2 text-sm font-bold text-indigo-700"
            >
              + Ҳавола
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {settings.usefulLinks.map((item, index) => (
              <div
                key={`${index}-${item.label}`}
                className="grid gap-3 rounded-xl bg-slate-50 p-3 md:grid-cols-[.8fr_1.5fr_auto]"
              >
                <input
                  value={item.label}
                  onChange={(event) =>
                    updateUseful(
                      index,
                      "label",
                      event.target.value,
                    )
                  }
                  className="h-11 rounded-lg border border-slate-200 bg-white px-3"
                />
                <input
                  value={item.url}
                  onChange={(event) =>
                    updateUseful(
                      index,
                      "url",
                      event.target.value,
                    )
                  }
                  className="h-11 rounded-lg border border-slate-200 bg-white px-3"
                />
                <button
                  type="button"
                  onClick={() =>
                    setSettings((current) => ({
                      ...current,
                      usefulLinks:
                        current.usefulLinks.filter(
                          (_, itemIndex) =>
                            itemIndex !== index,
                        ),
                    }))
                  }
                  className="px-4 text-sm font-bold text-red-600"
                >
                  Ўчириш
                </button>
              </div>
            ))}
          </div>
        </form>
      </div>
    </main>
  );
}
