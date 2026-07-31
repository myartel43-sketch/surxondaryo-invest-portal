import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight, Building2, CalendarDays, CheckCircle2, Download, Factory, FileText,
  Globe2, Landmark, Mail, MapPin, Phone, Search, Send, Users, BriefcaseBusiness,
  Newspaper, Image as ImageIcon, ShieldCheck, ExternalLink, Layers3
} from "lucide-react";
import { PageHero, SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { projects, districts, exportPartners } from "@/components/site/data";
import { CONTACTS } from "@/lib/site-config";
import { useI18n } from "@/i18n";

const staff = [
  { name: "Бошқарма бошлиғи", role: "Раҳбарият", phone: "+998 (76) 224-14-15", email: "info@surxondaryo-invest.uz" },
  { name: "Инвестициялар бўлими бошлиғи", role: "Инвестициялар", phone: "+998 (76) 224-14-15", email: "investment@surxondaryo-invest.uz" },
  { name: "Саноатни ривожлантириш бўлими", role: "Саноат", phone: "+998 (76) 224-14-15", email: "industry@surxondaryo-invest.uz" },
  { name: "Экспортни қўллаб-қувватлаш бўлими", role: "Ташқи савдо", phone: "+998 (76) 224-14-15", email: "export@surxondaryo-invest.uz" },
];

const news = [
  { title: "2026 йил инвестиция дастури ижроси", date: "31.07.2026", text: "Ҳудудий лойиҳалар, ўзлаштирилган инвестициялар ва янги иш ўринлари бўйича натижалар." },
  { title: "Экспортчилар билан очиқ мулоқот", date: "25.07.2026", text: "Тадбиркорларнинг сертификатлаш, логистика ва янги бозорларга чиқиш масалалари муҳокама қилинди." },
  { title: "Хорижий инвесторлар учун янги таклифлар", date: "18.07.2026", text: "Саноат, агросаноат, туризм ва логистика йўналишларида инвестиция таклифлари тақдим этилди." },
];

const documents = [
  { title: "2026 йил 1-ярим йилликда амалга оширилган ишлар", type: "DOCX", date: "2026", href: "/documents/2026-1-yarim-yillik.docx" },
  { title: "Инвестиция лойиҳаси паспорти намунаси", type: "PDF", date: "2026", href: "#" },
  { title: "Экспортчилар учун мурожаат шакли", type: "DOCX", date: "2026", href: "#" },
  { title: "Бўш ер майдонлари маълумотномаси", type: "XLSX", date: "2026", href: "#" },
];

const cardsByPage: Record<string, {title:string; text:string; icon:any}[]> = {
  investments: [
    { title: "Инвестиция таклифлари", text: "Саноат, агросаноат, логистика, туризм ва хизматлар соҳалари бўйича тайёр лойиҳалар.", icon: BriefcaseBusiness },
    { title: "Инвесторларга ҳамроҳлик", text: "Лойиҳа ғоясидан ишга туширишгача бир дарча тамойилида амалий кўмак.", icon: Users },
    { title: "Имтиёз ва преференциялар", text: "Амалдаги қонунчилик доирасида солиқ, божхона ва инфратузилма имкониятлари.", icon: ShieldCheck },
  ],
  industry: [
    { title: "Енгил саноат", text: "Тўқимачилик, ип-калава, тайёр кийим ва чарм-пойабзал ишлаб чиқариш.", icon: Factory },
    { title: "Қурилиш материаллари", text: "Цемент, гипс, базальт, мармар ва бошқа маҳаллий хомашёларни қайта ишлаш.", icon: Building2 },
    { title: "Озиқ-овқат саноати", text: "Мева-сабзавотни сақлаш, қайта ишлаш, қадоқлаш ва экспорт қилиш.", icon: Landmark },
  ],
  services: [
    { title: "Ер ва инфратузилма", text: "Бўш ер майдонларини танлаш, электр, газ, сув ва йўл инфратузилмаси бўйича маълумот.", icon: MapPin },
    { title: "Экспортга кўмак", text: "Сертификатлаш, божхона, логистика ва ташқи бозорларга чиқиш бўйича маслаҳат.", icon: Globe2 },
    { title: "Лойиҳа ҳужжатлари", text: "Бизнес-режа, техник-иқтисодий асос ва инвестиция паспортини тайёрлашга кўмак.", icon: FileText },
  ],
};

function SectionCards({ items }: { items: {title:string; text:string; icon:any}[] }) {
  return <div className="grid gap-5 md:grid-cols-3">{items.map((item) => <article key={item.title} className="lift rounded-2xl border border-border bg-card p-6"><span className="flex size-12 items-center justify-center rounded-xl gradient-brand text-primary-foreground"><item.icon className="size-5" /></span><h3 className="mt-5 text-lg font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p></article>)}</div>
}

function SearchBox({ value, onChange, placeholder }: {value:string; onChange:(v:string)=>void; placeholder:string}) {
  return <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><Input value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} className="pl-10"/></div>
}

export function PortalPage({ page, title }: { page:string; title:string }) {
  const { t } = useI18n();
  const [query,setQuery]=useState("");
  const [sent,setSent]=useState(false);
  const filteredProjects=useMemo(()=>projects.filter(p=>`${p.title} ${p.sector} ${p.district}`.toLowerCase().includes(query.toLowerCase())),[query]);
  const filteredStaff=useMemo(()=>staff.filter(p=>`${p.name} ${p.role}`.toLowerCase().includes(query.toLowerCase())),[query]);
  const filteredDocs=useMemo(()=>documents.filter(p=>p.title.toLowerCase().includes(query.toLowerCase())),[query]);

  const subtitle: Record<string,string> = {
    leadership:"Бошқарма раҳбарияти, қабул кунлари ва алоқа маълумотлари.", structure:"Бошқарманинг ташкилий тузилмаси ва асосий бўлимлари.", staff:"Ходимлар, бўлимлар ва қабул маълумотлари.", investments:"Инвесторлар учун имкониятлар, хизматлар ва лойиҳалар.", projects:"Сурхондарё вилоятидаги устувор инвестиция лойиҳалари.", land:"Бўш ер майдонлари ва мавжуд инфратузилма.", map:"Инвестиция объектлари ва саноат зоналарининг интерактив харитаси.", industry:"Ҳудуднинг саноат тармоқлари ва ишлаб чиқариш салоҳияти.", export:"Экспорт географияси, маҳсулотлар ва ташқи савдо кўрсаткичлари.", services:"Тадбиркорлар ва инвесторларга кўрсатиладиган хизматлар.", news:"Бошқарма фаолиятига оид сўнгги янгиликлар.", media:"Фото, видео ва тадбирлар галереяси.", documents:"Норматив ҳужжатлар, ҳисоботлар ва шакллар.", contacts:"Манзил, телефон, иш вақти ва расмий платформалар.", reception:"Электрон мурожаат юбориш ва ҳолатини кузатиш.", cabinet:"Инвесторнинг шахсий кабинети." };

  let content:any=null;
  if (page==="projects") content=<><SearchBox value={query} onChange={setQuery} placeholder="Лойиҳа, соҳа ёки туман бўйича қидириш"/><div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filteredProjects.map(p=><article key={p.title} className="rounded-2xl border border-border bg-card p-6"><span className="text-xs font-semibold uppercase tracking-wide text-green">{p.sector}</span><h3 className="mt-3 text-lg font-bold">{p.title}</h3><div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div><p className="text-muted-foreground">Қиймати</p><b>{p.amount}</b></div><div><p className="text-muted-foreground">Иш ўрни</p><b>{p.jobs}</b></div><div><p className="text-muted-foreground">Ҳудуд</p><b>{p.district}</b></div><div><p className="text-muted-foreground">Ҳолати</p><b>{p.status}</b></div></div><Button className="mt-6 w-full">Батафсил <ArrowRight className="size-4"/></Button></article>)}</div></>;
  else if (page==="staff"||page==="leadership") content=<><SearchBox value={query} onChange={setQuery} placeholder="Ходим ёки бўлим бўйича қидириш"/><div className="mt-8 grid gap-5 md:grid-cols-2">{filteredStaff.map((s,i)=><article key={s.name} className="flex gap-5 rounded-2xl border border-border bg-card p-6"><div className="flex size-16 shrink-0 items-center justify-center rounded-full gradient-brand text-xl font-bold text-white">{i+1}</div><div><p className="text-xs font-semibold uppercase tracking-wide text-green">{s.role}</p><h3 className="mt-1 text-lg font-bold">{s.name}</h3><a className="mt-3 flex items-center gap-2 text-sm text-muted-foreground" href={`tel:${s.phone}`}><Phone className="size-4"/>{s.phone}</a><a className="mt-2 flex items-center gap-2 text-sm text-muted-foreground" href={`mailto:${s.email}`}><Mail className="size-4"/>{s.email}</a></div></article>)}</div></>;
  else if (page==="structure") content=<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{["Раҳбарият","Инвестицияларни жалб қилиш бўлими","Саноатни ривожлантириш бўлими","Экспортни қўллаб-қувватлаш бўлими","Хорижий ҳамкорлик бўлими","Мурожаатлар билан ишлаш бўлими"].map((x,i)=><article key={x} className="rounded-2xl border border-border bg-card p-6"><span className="text-3xl font-black text-primary/20">0{i+1}</span><h3 className="mt-3 font-bold">{x}</h3><p className="mt-2 text-sm text-muted-foreground">Бўлимнинг вазифалари, масъул ходимлар ва алоқа маълумотлари.</p></article>)}</div>;
  else if (page==="land") content=<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{districts.map(d=><article key={d.id} className="rounded-2xl border border-border bg-card p-6"><MapPin className="size-6 text-green"/><h3 className="mt-4 text-lg font-bold">{d.zone}</h3><p className="mt-1 text-sm text-muted-foreground">{d.name}</p><dl className="mt-5 space-y-2 text-sm"><div className="flex justify-between"><dt>Майдон</dt><dd className="font-semibold">{d.land}</dd></div><div className="flex justify-between"><dt>Электр</dt><dd>{d.power}</dd></div><div className="flex justify-between"><dt>Газ</dt><dd>{d.gas}</dd></div><div className="flex justify-between"><dt>Сув</dt><dd>{d.water}</dd></div></dl><Button asChild variant="outline" className="mt-6 w-full"><Link to="/map">Харитада кўриш</Link></Button></article>)}</div>;
  else if (page==="map") content=<div className="overflow-hidden rounded-3xl border border-border bg-card"><iframe title="Yandex map" src="https://yandex.com/map-widget/v1/?ll=67.2783%2C37.2242&z=11" className="h-[560px] w-full" loading="lazy"/><div className="border-t border-border p-5"><p className="text-sm text-muted-foreground">Админ-панел орқали объектлар, нуқталар ва ер майдонлари координаталарини бошқариш учун Yandex Maps API калити уланади.</p></div></div>;
  else if (page==="export") content=<><div className="grid gap-5 md:grid-cols-3"><article className="rounded-2xl border border-border bg-card p-6"><Globe2 className="size-6 text-green"/><p className="mt-4 text-3xl font-black text-primary">372,5 млн $</p><p className="text-sm text-muted-foreground">2026 йил январь–июнь экспорти</p></article><article className="rounded-2xl border border-border bg-card p-6"><Factory className="size-6 text-green"/><p className="mt-4 text-3xl font-black text-primary">214,7 млн $</p><p className="text-sm text-muted-foreground">Саноат маҳсулотлари экспорти</p></article><article className="rounded-2xl border border-border bg-card p-6"><Users className="size-6 text-green"/><p className="mt-4 text-3xl font-black text-primary">195 та</p><p className="text-sm text-muted-foreground">Экспорт фаолиятига жалб қилинган корхоналар</p></article></div><div className="mt-8 space-y-3">{exportPartners.map(x=><div key={x.country} className="rounded-xl border border-border bg-card p-4"><div className="flex justify-between gap-4"><b>{x.country}</b><span className="font-bold text-primary">{x.share}%</span></div><p className="mt-1 text-sm text-muted-foreground">{x.goods}</p></div>)}</div></>;
  else if (page==="documents") content=<><SearchBox value={query} onChange={setQuery} placeholder="Ҳужжат номи бўйича қидириш"/><div className="mt-8 overflow-hidden rounded-2xl border border-border">{filteredDocs.map(d=><div key={d.title} className="flex flex-wrap items-center gap-4 border-b border-border bg-card p-5 last:border-0"><FileText className="size-6 text-primary"/><div className="min-w-0 flex-1"><h3 className="font-semibold">{d.title}</h3><p className="text-sm text-muted-foreground">{d.type} · {d.date}</p></div><Button asChild variant="outline"><a href={d.href} download={d.href !== "#"}><Download className="size-4"/> Юклаб олиш</a></Button></div>)}</div></>;
  else if (page==="news") content=<div className="grid gap-5 md:grid-cols-3">{news.map(n=><article key={n.title} className="overflow-hidden rounded-2xl border border-border bg-card"><div className="flex h-40 items-center justify-center gradient-brand"><Newspaper className="size-12 text-white/80"/></div><div className="p-6"><p className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="size-4"/>{n.date}</p><h3 className="mt-3 text-lg font-bold">{n.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{n.text}</p></div></article>)}</div>;
  else if (page==="media") content=<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map(i=><article key={i} className="overflow-hidden rounded-2xl border border-border bg-card"><div className="flex aspect-video items-center justify-center gradient-brand"><ImageIcon className="size-12 text-white/75"/></div><div className="p-4"><h3 className="font-semibold">Тадбирлар ва учрашувлар — {i}</h3><p className="mt-1 text-sm text-muted-foreground">Фото ва видео материаллар</p></div></article>)}</div>;
  else if (page==="contacts") content=<div className="grid gap-6 lg:grid-cols-2"><div className="rounded-2xl border border-border bg-card p-6"><h2 className="text-xl font-bold">Алоқа маълумотлари</h2><div className="mt-6 space-y-5 text-sm"><p className="flex gap-3"><MapPin className="size-5 text-green"/>Termiz shahar, Tuproqqo‘rg‘on mahallasi, Dilnavo ko‘chasi, 16-v-uy</p><a className="flex gap-3" href="tel:+998762241415"><Phone className="size-5 text-green"/>+998 (76) 224-14-15</a><p className="flex gap-3"><CalendarDays className="size-5 text-green"/>Dushanba–Juma, 09:00–18:00 (tushlik 13:00–14:00)</p></div><h3 className="mt-8 font-bold">Расмий платформалар</h3><div className="mt-3 grid gap-3">{[["Invest.gov.uz","https://invest.gov.uz"],["Surxonstat.uz","https://surxonstat.uz"],["E-auksion.uz","https://e-auksion.uz"]].map(([a,b])=><a key={a} href={b} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-border p-4 font-semibold hover:bg-muted">{a}<ExternalLink className="size-4"/></a>)}</div></div><iframe title="Yandex location" src="https://yandex.com/map-widget/v1/?ll=67.2783%2C37.2242&z=14" className="min-h-[500px] w-full rounded-2xl border border-border" loading="lazy"/></div>;
  else if (page==="reception") content=<div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8">{sent?<div className="py-16 text-center"><CheckCircle2 className="mx-auto size-14 text-green"/><h2 className="mt-5 text-2xl font-bold">Мурожаат қабул қилинди</h2><p className="mt-2 text-muted-foreground">Мурожаат рақами: SRX-{Date.now().toString().slice(-6)}</p></div>:<form onSubmit={e=>{e.preventDefault();setSent(true)}} className="grid gap-5"><div className="grid gap-5 sm:grid-cols-2"><Input required placeholder="Исм ва фамилия"/><Input required placeholder="Телефон"/></div><Input type="email" placeholder="Email"/><Input required placeholder="Мурожаат мавзуси"/><Textarea required rows={7} placeholder="Мурожаат матни"/><Button type="submit" size="lg"><Send className="size-4"/> Юбориш</Button></form>}</div>;
  else if (page==="cabinet") content=<div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8"><ShieldCheck className="size-10 text-primary"/><h2 className="mt-5 text-2xl font-bold">Инвестор кабинети</h2><p className="mt-2 text-sm text-muted-foreground">Аризалар, ҳужжатлар ва лойиҳа ҳолатини кузатиш.</p><form className="mt-7 grid gap-4"><Input type="email" placeholder="Email"/><Input type="password" placeholder="Пароль"/><Button>Кириш</Button><Button type="button" variant="outline">Рўйхатдан ўтиш</Button></form></div>;
  else content=<SectionCards items={cardsByPage[page] || cardsByPage.services}/>;

  return <SiteLayout><PageHero title={title} breadcrumb={t("org.short")} subtitle={subtitle[page] || "Расмий маълумот ва электрон хизматлар."}/><main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">{content}</main></SiteLayout>;
}
