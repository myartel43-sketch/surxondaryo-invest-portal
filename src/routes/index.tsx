import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Building2, Factory, Globe2, Handshake, MapPin, MapPinned,
  Percent, Route as RouteIcon, Users, Newspaper, ChevronLeft, ChevronRight,
  TrendingUp, BriefcaseBusiness, Truck,
} from "lucide-react";
import heroImage from "@/assets/hero-surkhandarya.jpg";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { StatCounter } from "@/components/site/StatCounter";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { advantagesText, homeText, statsText } from "@/components/site/localized-content";
import { local } from "@/components/site/data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Сурхондарё вилояти инвестициялар, саноат ва савдо бошқармаси" }] }),
  component: HomePage,
});

const statMeta = [
  [TrendingUp, 1413.8, "bg-blue-600"],
  [Factory, 111, "bg-green-600"],
  [Users, 2230, "bg-orange-500"],
  [Globe2, 24, "bg-violet-600"],
  [Truck, 372.5, "bg-cyan-600"],
] as const;
const advantageIcons = [MapPin, RouteIcon, Users, Percent, MapPinned, Handshake] as const;

function HomePage() {
  const { lang, t } = useI18n();
  const tx = (value: any) => local(value, lang);
  return (
    <SiteLayout>
      <section className="relative isolate overflow-hidden">
        <img src={heroImage} alt={tx(homeText.heroTitle)} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,31,68,.95)_0%,rgba(1,49,91,.73)_50%,rgba(1,43,75,.18)_100%)]" />
        <button aria-label={lang === "ru" ? "Предыдущий слайд" : lang === "en" ? "Previous slide" : lang === "zh" ? "上一张" : "Олдинги слайд"} className="absolute left-5 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/50 bg-black/15 p-3 text-white backdrop-blur md:block"><ChevronLeft /></button>
        <button aria-label={lang === "ru" ? "Следующий слайд" : lang === "en" ? "Next slide" : lang === "zh" ? "下一张" : "Кейинги слайд"} className="absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/50 bg-black/15 p-3 text-white backdrop-blur md:block"><ChevronRight /></button>
        <div className="relative mx-auto max-w-[1480px] px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-[58px]">
              {tx(homeText.heroTitle)}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 sm:text-lg">{tx(homeText.heroSubtitle)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-orange-500 px-6 text-white hover:bg-orange-600"><Link to="/investments">{tx(homeText.becomeInvestor)} <ArrowRight className="size-4" /></Link></Button>
              <Button asChild size="lg" className="bg-blue-700 px-6 text-white hover:bg-blue-800"><Link to="/projects">{t("nav.projects")}</Link></Button>
              <Button asChild size="lg" variant="secondary" className="px-6"><Link to="/land">{t("nav.land")}</Link></Button>
              <Button asChild size="lg" className="bg-green-600 px-6 text-white hover:bg-green-700"><Link to="/reception">{t("nav.reception")}</Link></Button>
            </div>
            <div className="mt-6 flex gap-2"><span className="h-2 w-7 rounded-full bg-white"/><span className="size-2 rounded-full bg-white/60"/><span className="size-2 rounded-full bg-white/60"/><span className="size-2 rounded-full bg-white/60"/></div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-1 max-w-[1480px] px-4 sm:px-6">
        <div className="grid gap-4 bg-white py-5 sm:grid-cols-2 lg:grid-cols-5">
          {statMeta.map(([Icon,value,color], index) => { const [label, unit] = statsText[index]; return (
            <article key={tx(label)} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_26px_rgba(15,23,42,.08)]">
              <span className={`grid size-12 shrink-0 place-items-center rounded-full text-white ${color}`}><Icon className="size-6"/></span>
              <div><p className="text-xs font-semibold text-slate-600">{tx(label)}</p><p className="mt-1 text-2xl font-extrabold text-[#073b77]"><StatCounter value={value}/></p><p className="text-[11px] text-slate-400">{tx(unit)}</p></div>
            </article>
          )})}
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6">
        <div className="text-center"><h2 className="text-2xl font-extrabold text-[#082e5c] sm:text-3xl">{tx(homeText.why)}</h2><div className="mx-auto mt-3 h-1 w-14 rounded bg-blue-600" /></div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {advantagesText.map(([title,desc], index) => { const Icon = advantageIcons[index]; return <article key={tx(title)} className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><Icon className="mx-auto size-8 text-blue-600"/><h3 className="mt-4 text-sm font-bold text-slate-900">{tx(title)}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{tx(desc)}</p></article>})}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1480px] gap-5 px-4 pb-12 sm:px-6 lg:grid-cols-[1fr_1.15fr_1.3fr]">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-extrabold text-[#082e5c]">{t("section.map")}</h2><div className="mt-4 min-h-52 rounded-lg bg-[radial-gradient(circle_at_28%_40%,#ccefd7,transparent_22%),radial-gradient(circle_at_68%_46%,#d8e7ff,transparent_18%),linear-gradient(135deg,#f7fafc,#e1ecf5)] p-4"><div className="relative h-44"><MapPin className="absolute left-[28%] top-[32%] size-7 text-green-600"/><MapPin className="absolute left-[54%] top-[45%] size-7 text-blue-600"/><MapPin className="absolute left-[72%] top-[28%] size-7 text-blue-600"/></div></div><Button asChild className="mt-4"><Link to="/map">{tx(homeText.mapGo)}</Link></Button></article>
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-extrabold text-[#082e5c]">{tx(homeText.latestNews)}</h2><div className="mt-4 grid gap-4 sm:grid-cols-[180px_1fr]"><div className="min-h-40 rounded-lg bg-[linear-gradient(135deg,#0d4f93,#42a5f5)]"/><div><p className="text-xs text-blue-600">{tx(homeText.newsDate)}</p><h3 className="mt-2 font-bold text-slate-900">{tx(homeText.newsTitle)}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{tx(homeText.newsDesc)}</p><Link to="/news" className="mt-4 inline-flex text-sm font-bold text-blue-700">{t("common.more")} →</Link></div></div></article>
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-extrabold text-[#082e5c]">{tx(homeText.featuredProject)}</h2><div className="mt-4 grid gap-4 sm:grid-cols-[210px_1fr]"><div className="min-h-40 rounded-lg bg-[linear-gradient(135deg,#d7eef8,#8dc7e8)]"/><div><p className="text-xs font-semibold text-blue-600">{tx(homeText.projectSector)}</p><h3 className="mt-2 font-bold">{tx(homeText.projectTitle)}</h3><p className="mt-2 text-sm text-slate-500">{tx(homeText.projectDistrict)}</p><p className="mt-4 text-xl font-extrabold text-[#082e5c]">{tx(homeText.projectAmount)}</p><span className="mt-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">{tx(homeText.projectStatus)}</span></div></div><Button asChild className="mt-4"><Link to="/projects">{t("common.more")}</Link></Button></article>
      </section>
    </SiteLayout>
  );
}
