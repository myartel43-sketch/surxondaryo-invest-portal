import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import {
  BarChart3,
  Building2,
  FileText,
  Globe2,
  Image,
  Link2,
  MapPinned,
  Menu,
  Newspaper,
  Plus,
  Save,
  Users,
} from "lucide-react";
import { AdminSidebar, type AdminModule } from "@/components/admin/AdminSidebar";
import { ContentManagers } from "@/components/admin/ContentManagers";
import { ExtraManagers } from "@/components/admin/ExtraManagers";
import { getStoredSession, type SupabaseSession } from "@/lib/supabase-auth";
import {
  DEFAULT_SITE_SETTINGS,
  loadSiteSettings,
  saveSiteSettings,
  type SiteSettings,
} from "@/lib/site-settings";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const modules = [
  { key: "news" as const, icon: Newspaper, title: "Янгиликлар", desc: "Янгиликларни қўшиш ва таҳрирлаш" },
  { key: "projects" as const, icon: Building2, title: "Инвестиция лойиҳалари", desc: "Лойиҳалар каталоги" },
  { key: "staff" as const, icon: Users, title: "Ходимлар", desc: "Раҳбарият ва ходимлар" },
  { key: "documents" as const, icon: FileText, title: "Ҳужжатлар", desc: "PDF, DOCX ва бошқа файллар" },
  { key: "media" as const, icon: Image, title: "Медиа", desc: "Фото ва видеолар" },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const current = getStoredSession();
    if (!current) {
      navigate({ to: "/admin/login" });
      return;
    }
    setSession(current);
    loadSiteSettings().then(setSettings).finally(() => setReady(true));
  }, [navigate]);

  function openModule(module: AdminModule, action: "list" | "add") {
    window.dispatchEvent(
      new CustomEvent("admin:open-module", { detail: { module, action } }),
    );
    setMenuOpen(false);
    window.setTimeout(() => {
      document.getElementById(
        action === "add" ? "extra-editor-form" : "extra-content",
      )?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      setStatus(error instanceof Error ? error.message : "Сақлашда хато.");
    } finally {
      setSaving(false);
    }
  }

  function updateSocial(key: keyof SiteSettings["socialLinks"], value: string) {
    setSettings((current) => ({
      ...current,
      socialLinks: { ...current.socialLinks, [key]: value },
    }));
  }

  function updateUseful(index: number, field: "label" | "url", value: string) {
    setSettings((current) => ({
      ...current,
      usefulLinks: current.usefulLinks.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  if (!ready) {
    return <div className="grid min-h-screen place-items-center bg-slate-100 font-bold text-slate-500">Юкланмоқда...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <AdminSidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        active="dashboard"
        onModule={openModule}
      />

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-7">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50"
          >
            <Menu />
          </button>
          <div>
            <h1 className="text-lg font-extrabold">Бошқарув панели</h1>
            <p className="text-xs text-slate-500">Барча админ бўлимлари бир жойда</p>
          </div>
        </div>
        <Link to="/" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold">Сайтни кўриш</Link>
      </header>

      <div className="mx-auto max-w-7xl p-4 sm:p-7">
        <section className="rounded-3xl bg-[linear-gradient(120deg,#073b77,#0b6b8f_60%,#15803d)] p-7 text-white shadow-xl">
          <p className="text-sm font-bold text-blue-100">Хуш келибсиз</p>
          <h2 className="mt-2 text-3xl font-extrabold">Ягона администратор панели</h2>
          <p className="mt-3 text-sm text-blue-50">{session?.user.email}</p>
        </section>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            [BarChart3, "Жами кўришлар", "—"],
            [Newspaper, "Янгиликлар", "0"],
            [Building2, "Лойиҳалар", "0"],
            [Globe2, "Тиллар", "4"],
          ].map(([Icon, title, value]) => (
            <article key={String(title)} className="rounded-2xl border bg-white p-5 shadow-sm">
              <Icon className="size-6 text-blue-700" />
              <p className="mt-4 text-sm font-semibold text-slate-500">{String(title)}</p>
              <p className="mt-1 text-3xl font-extrabold">{String(value)}</p>
            </article>
          ))}
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-extrabold">Барча бошқарув бўлимлари</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map(({ key, icon: Icon, title, desc }) => (
              <article key={key} className="rounded-2xl border bg-white p-5 shadow-sm">
                <Icon className="size-7 text-blue-700" />
                <h3 className="mt-4 text-lg font-extrabold">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{desc}</p>
                <button
                  type="button"
                  onClick={() => openModule(key, "add")}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white"
                >
                  <Plus className="size-4" /> Қўшиш
                </button>
              </article>
            ))}

            <Link
              to="/admin/map"
              className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <MapPinned className="size-7 text-green-700" />
              <h3 className="mt-4 text-lg font-extrabold">Ер майдонлари ва харита</h3>
              <p className="mt-2 text-sm text-slate-500">Чизиш, таҳрирлаш ва площадь ҳисоблаш</p>
              <span className="mt-5 inline-flex rounded-xl bg-green-700 px-4 py-2.5 text-sm font-bold text-white">Харитани очиш</span>
            </Link>
          </div>
        </section>

        {session && <ContentManagers session={session} />}
        {session && <ExtraManagers session={session} />}

        <form id="links" onSubmit={submitSettings} className="mt-8 rounded-3xl border bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-extrabold"><Link2 />Ҳаволалар ва иконкалар</h2>
              <p className="mt-1 text-sm text-slate-500">Футер ва ижтимоий тармоқ манзиллари</p>
            </div>
            <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-60">
              <Save className="size-4" />{saving ? "Сақланмоқда..." : "Сақлаш"}
            </button>
          </div>

          {status && <p className="mt-5 rounded-xl bg-blue-50 p-4 text-sm font-semibold text-blue-800">{status}</p>}

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {Object.entries(settings.socialLinks).map(([key, value]) => (
              <label key={key} className="text-sm font-bold capitalize">
                {key}
                <input value={value} onChange={(event) => updateSocial(key as keyof SiteSettings["socialLinks"], event.target.value)} className="mt-2 h-12 w-full rounded-xl border px-4" />
              </label>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h3 className="text-lg font-extrabold">Фойдали ҳаволалар</h3>
            <button type="button" onClick={() => setSettings((current) => ({ ...current, usefulLinks: [...current.usefulLinks, { label: "Янги ҳавола", url: "https://" }] }))} className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-bold text-blue-700">+ Ҳавола</button>
          </div>

          <div className="mt-4 space-y-3">
            {settings.usefulLinks.map((item, index) => (
              <div key={`${index}-${item.label}`} className="grid gap-3 rounded-xl bg-slate-50 p-3 md:grid-cols-[.8fr_1.5fr_auto]">
                <input value={item.label} onChange={(event) => updateUseful(index, "label", event.target.value)} className="h-11 rounded-lg border px-3" />
                <input value={item.url} onChange={(event) => updateUseful(index, "url", event.target.value)} className="h-11 rounded-lg border px-3" />
                <button type="button" onClick={() => setSettings((current) => ({ ...current, usefulLinks: current.usefulLinks.filter((_, itemIndex) => itemIndex !== index) }))} className="px-4 text-sm font-bold text-red-600">Ўчириш</button>
              </div>
            ))}
          </div>
        </form>
      </div>
    </main>
  );
}
