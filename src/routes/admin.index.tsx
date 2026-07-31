import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BarChart3, Building2, FileText, Globe2, Image, LayoutDashboard, LogOut, MapPinned, Menu, Newspaper, Settings, Users, X } from "lucide-react";
import { getStoredSession, signOut, type SupabaseSession } from "@/lib/supabase-auth";

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

  useEffect(() => {
    const current = getStoredSession();
    if (!current) {
      navigate({ to: "/admin/login" });
      return;
    }
    setSession(current);
    setReady(true);
  }, [navigate]);

  function logout() {
    signOut();
    navigate({ to: "/admin/login" });
  }

  if (!ready) return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm font-bold text-slate-500">Текширилмоқда...</div>;

  const sidebar = (
    <>
      <div className="flex items-center gap-3 border-b border-white/10 p-5"><img src="/brand/department-logo.png" className="size-12 object-contain" alt="Logo"/><div><p className="text-sm font-extrabold text-white">SURXONDARYO</p><p className="text-xs text-blue-200">ADMIN PANEL</p></div></div>
      <nav className="space-y-1 p-4 text-sm">
        <a className="flex items-center gap-3 rounded-xl bg-white/12 px-4 py-3 font-bold text-white" href="#dashboard"><LayoutDashboard className="size-5"/>Dashboard</a>
        {modules.map(([Icon, title]) => <a key={title} className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-blue-100 transition hover:bg-white/10 hover:text-white" href="#modules"><Icon className="size-5"/>{title}</a>)}
        <a className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-blue-100 transition hover:bg-white/10 hover:text-white" href="#settings"><Settings className="size-5"/>Созламалар</a>
      </nav>
      <div className="mt-auto border-t border-white/10 p-4"><button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-200 hover:bg-red-500/15"><LogOut className="size-5"/>Чиқиш</button></div>
    </>
  );

  return (
    <main className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[270px_1fr]">
      <aside className="hidden min-h-screen flex-col bg-[linear-gradient(180deg,#073b77,#052a55)] lg:flex">{sidebar}</aside>
      {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Close" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-slate-950/60"/><aside className="relative flex h-full w-[285px] flex-col bg-[#073b77]"><button onClick={() => setMobileOpen(false)} className="absolute right-3 top-3 rounded-lg p-2 text-white"><X/></button>{sidebar}</aside></div>}

      <section className="min-w-0">
        <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-7"><div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} className="rounded-lg border border-slate-200 p-2 lg:hidden"><Menu/></button><div><h1 className="text-lg font-extrabold text-slate-900">Бошқарув панели</h1><p className="text-xs text-slate-500">Сайт контентини бошқариш</p></div></div><div className="flex items-center gap-3"><Link to="/" className="hidden rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 sm:block">Сайтни кўриш</Link><div className="grid size-10 place-items-center rounded-full bg-blue-100 font-extrabold text-blue-800">A</div></div></header>

        <div className="mx-auto max-w-7xl p-4 sm:p-7">
          <section id="dashboard" className="rounded-3xl bg-[linear-gradient(120deg,#073b77,#0b6b8f_60%,#15803d)] p-7 text-white shadow-xl"><p className="text-sm font-bold text-blue-100">Хуш келибсиз</p><h2 className="mt-2 text-3xl font-extrabold">Администратор панели</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50">Кириш тасдиқланди: {session?.user.email}. Кейинги босқичда ҳар бир модуль Supabase базасига уланади.</p></section>

          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[[BarChart3,"Жами кўришлар","—"],[Newspaper,"Янгиликлар","0"],[Building2,"Лойиҳалар","0"],[Globe2,"Тиллар","4"]].map(([Icon,title,value]) => <article key={String(title)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon className="size-5"/></span><p className="mt-4 text-sm font-semibold text-slate-500">{title as string}</p><p className="mt-1 text-3xl font-extrabold text-slate-950">{value as string}</p></article>)}
          </section>

          <section id="modules" className="mt-8"><div className="flex items-end justify-between"><div><h2 className="text-2xl font-extrabold text-slate-950">Бошқарув бўлимлари</h2><p className="mt-1 text-sm text-slate-500">Биринчи версия: хавфсиз кириш ва панель асоси.</p></div></div><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{modules.map(([Icon,title,desc,count]) => <article key={title} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-start justify-between"><span className="grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon/></span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{count}</span></div><h3 className="mt-5 text-lg font-extrabold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p><button disabled className="mt-5 text-sm font-bold text-blue-700 opacity-60">Кейинги босқичда фаоллашади →</button></article>)}</div></section>
        </div>
      </section>
    </main>
  );
}
