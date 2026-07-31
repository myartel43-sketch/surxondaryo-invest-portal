import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import {
  BarChart3, Building2, FileText, Globe2, Image, LayoutDashboard, Link2,
  LogOut, MapPinned, Menu, Newspaper, Save, Settings, Users, X,
} from "lucide-react";
import { getStoredSession, signOut, type SupabaseSession } from "@/lib/supabase-auth";
import {
  DEFAULT_SITE_SETTINGS, loadSiteSettings, saveSiteSettings,
  type SiteSettings,
} from "@/lib/site-settings";
import { ContentManagers } from "@/components/admin/ContentManagers";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Администратор панели | Surxondaryo Invest" }] }),
  component: AdminDashboard,
});

const modules = [
  [Newspaper, "Янгиликлар", "Янгиликларни қўшиш ва таҳрирлаш", "0"],
  [Building2, "Инвестиция лойиҳалари", "Лойиҳалар каталоги", "0"],
  [Users, "Ходимлар", "Раҳбарият ва ходимлар", "0"],
  [FileText, "Ҳужжатлар", "PDF, DOCX ва бошқа файллар", "0"],
  [MapPinned, "Харита объектлари", "Ер майдонлари ва объектлар", "0"],
  [Image, "Медиа", "Фото ва видеолар", "0"],
] as const;

function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  function logout() {
    signOut();
    navigate({ to: "/admin/login" });
  }

  async function submitSettings(event: FormEvent) {
    event.preventDefault();
    if (!session) return;
    setSaving(true);
    setStatus("");
    try {
      await saveSiteSettings(settings, session);
      setStatus("Созламалар сақланди ва сайт футерига қўлланилди.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Сақлашда хато юз берди.");
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

  function addUseful() {
    setSettings((current) => ({
      ...current,
      usefulLinks: [...current.usefulLinks, { label: "Янги ҳавола", url: "https://" }],
    }));
  }

  function removeUseful(index: number) {
    setSettings((current) => ({
      ...current,
      usefulLinks: current.usefulLinks.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  if (!ready) {
    return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm font-bold text-slate-500">Юкланмоқда...</div>;
  }

  const sidebar = (
    <>
      <div className="flex items-center gap-3 border-b border-white/10 p-5">
        <img src="/brand/department-logo.png" className="size-12 object-contain" alt="Logo" />
        <div><p className="text-sm font-extrabold text-white">SURXONDARYO</p><p className="text-xs text-blue-200">ADMIN PANEL</p></div>
      </div>
      <nav className="space-y-1 p-4 text-sm">
        <a className="flex items-center gap-3 rounded-xl bg-white/12 px-4 py-3 font-bold text-white" href="#dashboard"><LayoutDashboard className="size-5" />Dashboard</a>
        {modules.map(([Icon, title]) => <a key={title} className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-blue-100 transition hover:bg-white/10 hover:text-white" href="#content-management"><Icon className="size-5" />{title}</a>)}
        <a className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-blue-100 transition hover:bg-white/10 hover:text-white" href="#links"><Link2 className="size-5" />Ҳаволалар ва иконкалар</a>
        <a className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-blue-100 transition hover:bg-white/10 hover:text-white" href="#settings"><Settings className="size-5" />Созламалар</a>
      </nav>
      <div className="mt-auto border-t border-white/10 p-4"><button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-200 hover:bg-red-500/15"><LogOut className="size-5" />Чиқиш</button></div>
    </>
  );

  return (
    <main className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[270px_1fr]">
      <aside className="hidden min-h-screen flex-col bg-[linear-gradient(180deg,#073b77,#052a55)] lg:flex">{sidebar}</aside>
      {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Close" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-slate-950/60" /><aside className="relative flex h-full w-[285px] flex-col bg-[#073b77]"><button onClick={() => setMobileOpen(false)} className="absolute right-3 top-3 rounded-lg p-2 text-white"><X /></button>{sidebar}</aside></div>}

      <section className="min-w-0">
        <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-7">
          <div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} className="rounded-lg border border-slate-200 p-2 lg:hidden"><Menu /></button><div><h1 className="text-lg font-extrabold text-slate-900">Бошқарув панели</h1><p className="text-xs text-slate-500">Сайт контентини бошқариш</p></div></div>
          <div className="flex items-center gap-3"><Link to="/" className="hidden rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 sm:block">Сайтни кўриш</Link><div className="grid size-10 place-items-center rounded-full bg-blue-100 font-extrabold text-blue-800">A</div></div>
        </header>

        <div className="mx-auto max-w-7xl p-4 sm:p-7">
          <section id="dashboard" className="rounded-3xl bg-[linear-gradient(120deg,#073b77,#0b6b8f_60%,#15803d)] p-7 text-white shadow-xl">
            <p className="text-sm font-bold text-blue-100">Хуш келибсиз</p><h2 className="mt-2 text-3xl font-extrabold">Администратор панели</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50">Кириш тасдиқланди: {session?.user.email}. Ижтимоий тармоқ ва фойдали ҳаволаларни қуйида ўзгартириш мумкин.</p>
          </section>

          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[[BarChart3, "Жами кўришлар", "—"], [Newspaper, "Янгиликлар", "0"], [Building2, "Лойиҳалар", "0"], [Globe2, "Тиллар", "4"]].map(([Icon, title, value]) => <article key={String(title)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon className="size-5" /></span><p className="mt-4 text-sm font-semibold text-slate-500">{title as string}</p><p className="mt-1 text-3xl font-extrabold text-slate-950">{value as string}</p></article>)}
          </section>

          <section id="modules" className="mt-8"><h2 className="text-2xl font-extrabold text-slate-950">Бошқарув бўлимлари</h2><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{modules.map(([Icon, title, desc, count]) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><span className="grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon /></span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{count}</span></div><h3 className="mt-5 text-lg font-extrabold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p></article>)}</div></section>

          {session && <ContentManagers session={session} />}

          <form id="links" onSubmit={submitSettings} className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-extrabold text-slate-950">Ҳаволалар ва ижтимоий тармоқ иконкалари</h2><p className="mt-1 text-sm text-slate-500">Футерда кўринадиган манзилларни шу ерда ўзгартиринг.</p></div><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60"><Save className="size-4" />{saving ? "Сақланмоқда..." : "Сақлаш"}</button></div>

            {status && <p className="mt-5 rounded-xl bg-blue-50 p-4 text-sm font-semibold text-blue-800">{status}</p>}

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {Object.entries(settings.socialLinks).map(([key, value]) => <label key={key} className="block"><span className="text-sm font-bold capitalize text-slate-700">{key}</span><input value={value} onChange={(event) => updateSocial(key as keyof SiteSettings["socialLinks"], event.target.value)} placeholder="https://" className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>)}
            </div>

            <div className="mt-8 flex items-center justify-between"><h3 className="text-lg font-extrabold text-slate-900">Фойдали ҳаволалар</h3><button type="button" onClick={addUseful} className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50">+ Ҳавола қўшиш</button></div>
            <div className="mt-4 space-y-3">{settings.usefulLinks.map((item, index) => <div key={`${index}-${item.label}`} className="grid gap-3 rounded-xl bg-slate-50 p-3 md:grid-cols-[.8fr_1.5fr_auto]"><input value={item.label} onChange={(event) => updateUseful(index, "label", event.target.value)} className="h-11 rounded-lg border border-slate-200 px-3" /><input value={item.url} onChange={(event) => updateUseful(index, "url", event.target.value)} className="h-11 rounded-lg border border-slate-200 px-3" /><button type="button" onClick={() => removeUseful(index)} className="rounded-lg px-4 text-sm font-bold text-red-600 hover:bg-red-50">Ўчириш</button></div>)}</div>
          </form>
        </div>
      </section>
    </main>
  );
}
