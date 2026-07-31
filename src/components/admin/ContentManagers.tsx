import { FormEvent, useEffect, useState } from "react";
import { Edit3, Plus, Save, Trash2, X } from "lucide-react";
import type { SupabaseSession } from "@/lib/supabase-auth";
import {
  createNews, createProject, deleteNews, deleteProject, emptyNews, emptyProject,
  listNews, listProjects, updateNews, updateProject,
  type NewsItem, type ProjectItem,
} from "@/lib/content-api";

type Mode = "news" | "projects";
const languages = [["uz", "Ўзбекча"], ["ru", "Русский"], ["en", "English"], ["zh", "中文"]] as const;

function TextField({ label, value, onChange, area = false, type = "text" }: { label:string; value:string|number; onChange:(value:string)=>void; area?:boolean; type?:string }) {
  const cls = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";
  return <label className="block"><span className="text-sm font-bold text-slate-700">{label}</span>{area ? <textarea rows={4} value={value} onChange={e=>onChange(e.target.value)} className={cls}/> : <input type={type} value={value} onChange={e=>onChange(e.target.value)} className={cls}/>}</label>;
}

export function ContentManagers({ session }: { session: SupabaseSession }) {
  const [mode, setMode] = useState<Mode>("news");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [newsForm, setNewsForm] = useState<any>(emptyNews());
  const [projectForm, setProjectForm] = useState<any>(emptyProject());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function reload() {
    setLoading(true); setMessage("");
    try { const [n,p] = await Promise.all([listNews(false, session), listProjects(false, session)]); setNews(n); setProjects(p); }
    catch (e) { setMessage(e instanceof Error ? e.message : "Маълумот юкланмади."); }
    finally { setLoading(false); }
  }
  useEffect(()=>{ void reload(); },[]);
  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ module?: string; action?: string }>).detail;
      if (detail?.module !== "news" && detail?.module !== "projects") return;
      setMode(detail.module);
      setEditingId(null);
      setNewsForm(emptyNews());
      setProjectForm(emptyProject());
      setMessage("");
      window.setTimeout(() => {
        document.getElementById(detail.action === "add" ? "content-editor-form" : "content-management")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    };
    window.addEventListener("admin:open-module", handler as EventListener);
    return () => window.removeEventListener("admin:open-module", handler as EventListener);
  }, []);

  function reset() { setEditingId(null); setNewsForm(emptyNews()); setProjectForm(emptyProject()); setMessage(""); }

  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setMessage("");
    try {
      if (mode === "news") {
        if (editingId) await updateNews(editingId, newsForm, session); else await createNews(newsForm, session);
      } else {
        const payload = { ...projectForm, jobs: Number(projectForm.jobs || 0) };
        if (editingId) await updateProject(editingId, payload, session); else await createProject(payload, session);
      }
      reset(); await reload(); setMessage("Маълумот муваффақиятли сақланди.");
    } catch(e) { setMessage(e instanceof Error ? e.message : "Сақлашда хато."); }
    finally { setSaving(false); }
  }

  function edit(item:any) {
    setEditingId(item.id);
    if (mode === "news") setNewsForm({ ...item }); else setProjectForm({ ...item });
    document.getElementById("content-editor-form")?.scrollIntoView({behavior:"smooth"});
  }

  async function remove(id:string) {
    if (!confirm("Ушбу маълумотни ўчиришни тасдиқлайсизми?")) return;
    try { if(mode==="news") await deleteNews(id,session); else await deleteProject(id,session); await reload(); }
    catch(e){ setMessage(e instanceof Error ? e.message : "Ўчиришда хато."); }
  }

  const items:any[] = mode === "news" ? news : projects;
  const form:any = mode === "news" ? newsForm : projectForm;
  const setForm:any = mode === "news" ? setNewsForm : setProjectForm;

  return <section id="content-management" className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h2 className="text-2xl font-extrabold text-slate-950">Контентни бошқариш</h2><p className="mt-1 text-sm text-slate-500">Янгиликлар ва инвестиция лойиҳаларини қўшинг, ўзгартиринг ёки ўчиринг.</p></div>
      <div className="flex rounded-xl bg-slate-100 p-1"><button type="button" onClick={()=>{setMode("news");reset()}} className={`rounded-lg px-4 py-2 text-sm font-bold ${mode==="news"?"bg-white text-blue-700 shadow":"text-slate-600"}`}>Янгиликлар ({news.length})</button><button type="button" onClick={()=>{setMode("projects");reset()}} className={`rounded-lg px-4 py-2 text-sm font-bold ${mode==="projects"?"bg-white text-blue-700 shadow":"text-slate-600"}`}>Лойиҳалар ({projects.length})</button></div>
    </div>

    {message && <p className="mt-5 rounded-xl bg-blue-50 p-4 text-sm font-semibold text-blue-800">{message}</p>}

    <form id="content-editor-form" onSubmit={submit} className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold">{editingId ? "Таҳрирлаш" : "Янги маълумот қўшиш"}</h3>{editingId && <button type="button" onClick={reset} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"><X className="size-4"/>Бекор қилиш</button>}</div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {languages.map(([code,label])=><div key={code} className="rounded-xl border border-slate-200 bg-white p-4"><h4 className="font-extrabold text-blue-800">{label}</h4><div className="mt-4 space-y-4"><TextField label="Сарлавҳа" value={form[`title_${code}`]||""} onChange={v=>setForm((c:any)=>({...c,[`title_${code}`]:v}))}/><TextField area label="Қисқача мазмун" value={form[`description_${code}`]||""} onChange={v=>setForm((c:any)=>({...c,[`description_${code}`]:v}))}/></div></div>)}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {mode==="news" ? <TextField type="date" label="Сана" value={form.published_at||""} onChange={v=>setForm((c:any)=>({...c,published_at:v}))}/> : <><TextField label="Соҳа" value={form.sector||""} onChange={v=>setForm((c:any)=>({...c,sector:v}))}/><TextField label="Туман/шаҳар" value={form.district||""} onChange={v=>setForm((c:any)=>({...c,district:v}))}/><TextField label="Қиймати" value={form.amount||""} onChange={v=>setForm((c:any)=>({...c,amount:v}))}/><TextField type="number" label="Иш ўринлари" value={form.jobs||0} onChange={v=>setForm((c:any)=>({...c,jobs:v}))}/><TextField label="Ҳолати" value={form.status||""} onChange={v=>setForm((c:any)=>({...c,status:v}))}/></>}
        <TextField label="Расм URL" value={form.image_url||""} onChange={v=>setForm((c:any)=>({...c,image_url:v}))}/>
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"><input type="checkbox" checked={Boolean(form.is_published)} onChange={e=>setForm((c:any)=>({...c,is_published:e.target.checked}))}/><span className="text-sm font-bold">Сайтда кўрсатиш</span></label>
      </div>
      <button disabled={saving} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60"><Save className="size-4"/>{saving?"Сақланмоқда...":editingId?"Ўзгаришни сақлаш":"Қўшиш"}</button>
    </form>

    <div className="mt-7"><h3 className="text-lg font-extrabold">Мавжуд маълумотлар</h3>{loading?<p className="mt-4 text-sm text-slate-500">Юкланмоқда...</p>:items.length===0?<div className="mt-4 rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500"><Plus className="mx-auto mb-3"/>Ҳали маълумот қўшилмаган.</div>:<div className="mt-4 space-y-3">{items.map(item=><article key={item.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 p-4"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h4 className="font-extrabold">{item.title_uz||"Сарлавҳасиз"}</h4><span className={`rounded-full px-2 py-1 text-[11px] font-bold ${item.is_published?"bg-green-100 text-green-700":"bg-slate-100 text-slate-600"}`}>{item.is_published?"Эълон қилинган":"Қоралама"}</span></div><p className="mt-1 line-clamp-2 text-sm text-slate-500">{item.description_uz}</p>{mode==="projects"&&<p className="mt-2 text-xs font-semibold text-blue-700">{item.sector} · {item.district} · {item.amount}</p>}</div><button type="button" onClick={()=>edit(item)} className="rounded-lg p-3 text-blue-700 hover:bg-blue-50"><Edit3 className="size-5"/></button><button type="button" onClick={()=>remove(item.id)} className="rounded-lg p-3 text-red-600 hover:bg-red-50"><Trash2 className="size-5"/></button></article>)}</div>}</div>
  </section>;
}
