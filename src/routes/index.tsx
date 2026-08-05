import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Factory,
  Globe2,
  Handshake,
  Landmark,
  MapPinned,
  Newspaper,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import heroImage from "@/assets/hero-surkhandarya.jpg";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { StatCounter } from "@/components/site/StatCounter";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import {
  advantagesText,
  homeText,
  statsText,
} from "@/components/site/localized-content";
import { local } from "@/components/site/data";
import "@/government-premium.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Сурхондарё вилояти инвестициялар, саноат ва савдо бошқармаси",
      },
    ],
  }),
  component: HomePage,
});

const statMeta = [
  [TrendingUp, 1413.8, "Савдо айланмаси"],
  [Factory, 111, "Инвестиция лойиҳалари"],
  [Users, 2230, "Янги иш ўринлари"],
  [Globe2, 24, "Ҳамкор давлатлар"],
  [Truck, 372.5, "Экспорт салоҳияти"],
] as const;

const premiumAdvantages = [
  [Landmark, "Стратегик жойлашув"],
  [Truck, "Транспорт коридорлари"],
  [Users, "Малакали кадрлар"],
  [ShieldCheck, "Инвесторлар ҳимояси"],
  [MapPinned, "Тайёр ер майдонлари"],
  [Handshake, "Бир дарча хизмати"],
] as const;

function HomePage() {
  const { lang, t } = useI18n();
  const tx = (value: any) => local(value, lang);

  return (
    <SiteLayout>
      <section className="premium-hero relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt={tx(homeText.heroTitle)}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="premium-hero-overlay absolute inset-0" />
        <div className="premium-hero-grid absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto grid min-h-[690px] max-w-[1480px] items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.18fr_.82fr] lg:py-24">
          <div className="max-w-4xl">
            <div className="premium-kicker inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[.22em] text-amber-200 backdrop-blur">
              <Sparkles className="size-4" />
              Surxondaryo Investment Gateway
            </div>

            <h1 className="mt-7 max-w-4xl text-4xl font-black leading-[1.05] text-white sm:text-6xl lg:text-[72px]">
              {tx(homeText.heroTitle)}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
              {tx(homeText.heroSubtitle)}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="premium-gold-button h-13 rounded-xl px-7 text-[#08284f]">
                <Link to="/investments">
                  {tx(homeText.becomeInvestor)}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-13 rounded-xl border-white/30 bg-white/8 px-7 text-white backdrop-blur hover:bg-white/15 hover:text-white">
                <Link to="/projects">{t("nav.projects")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-13 rounded-xl border-white/30 bg-white/8 px-7 text-white backdrop-blur hover:bg-white/15 hover:text-white">
                <Link to="/map">{t("nav.map")}</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-white/72">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-300" />
                Давлат кафолати ва қўллаб-қувватлаш
              </span>
              <span className="inline-flex items-center gap-2">
                <Handshake className="size-4 text-amber-300" />
                Инвестор учун ягона ҳамкор
              </span>
            </div>
          </div>

          <aside className="premium-hero-panel hidden rounded-[28px] border border-white/15 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-xl lg:block">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-amber-200">
              Ҳудуд имкониятлари
            </p>
            <h2 className="mt-3 text-2xl font-extrabold">
              Жанубий Ўзбекистоннинг инвестиция маркази
            </h2>
            <div className="mt-6 grid gap-3">
              {[
                [Building2, "Саноат зоналари ва тайёр инфратузилма"],
                [MapPinned, "Интерактив ер майдонлари харитаси"],
                [Globe2, "Экспорт бозорларига қулай чиқиш"],
                [Handshake, "Лойиҳани тўлиқ ҳамроҳлик қилиш"],
              ].map(([Icon, label]) => (
                <div key={String(label)} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/7 p-4">
                  <span className="grid size-11 place-items-center rounded-xl bg-amber-300/15 text-amber-200">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-sm font-semibold leading-5 text-white/88">
                    {String(label)}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="premium-stats-wrap relative z-10 mx-auto -mt-14 max-w-[1480px] px-4 sm:px-6">
        <div className="grid gap-3 rounded-[26px] border border-slate-200/80 bg-white p-4 shadow-[0_30px_80px_-35px_rgba(3,43,91,.45)] sm:grid-cols-2 lg:grid-cols-5">
          {statMeta.map(([Icon, value], index) => {
            const [label, unit] = statsText[index];
            return (
              <article key={tx(label)} className="premium-stat-card group rounded-2xl px-5 py-5 transition">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-[#072f5f] text-amber-300 transition group-hover:scale-105">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">2026</span>
                </div>
                <p className="mt-5 text-[11px] font-bold uppercase tracking-[.12em] text-slate-500">
                  {tx(label)}
                </p>
                <p className="mt-2 text-3xl font-black text-[#072f5f]">
                  <StatCounter value={value} />
                </p>
                <p className="mt-1 text-xs text-slate-400">{tx(unit)}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="premium-section mx-auto max-w-[1480px] px-4 py-20 sm:px-6">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="premium-section-label">Инвестор учун афзалликлар</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-[#072f5f] sm:text-5xl">
              {tx(homeText.why)}
            </h2>
          </div>
          <Link to="/investments" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#0b6b8f] hover:text-[#072f5f]">
            Барча имкониятлар
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {advantagesText.map(([title, desc], index) => {
            const [Icon] = premiumAdvantages[index];
            return (
              <article key={tx(title)} className="premium-advantage-card group rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-13 place-items-center rounded-2xl bg-[#072f5f] text-amber-300 transition group-hover:-translate-y-1">
                    <Icon className="size-6" />
                  </span>
                  <span className="text-5xl font-black text-slate-100">0{index + 1}</span>
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-[#08284f]">
                  {tx(title)}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{tx(desc)}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="premium-feature-band bg-[#061f3d] text-white">
        <div className="mx-auto grid max-w-[1480px] gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <p className="premium-section-label text-amber-300">Инвестиция географияси</p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
              Бўш ер майдонларини харитада кўринг
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/68">
              Спутник ва оддий харита, майдон чегаралари, автоматик ҳисобланган гектар ва объект ҳақидаги маълумотлар.
            </p>
            <Button asChild size="lg" className="premium-gold-button mt-8 rounded-xl px-7 text-[#08284f]">
              <Link to="/map">
                Интерактив харитани очиш
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="premium-map-preview relative min-h-[340px] overflow-hidden rounded-[28px] border border-white/12 bg-[radial-gradient(circle_at_30%_35%,rgba(34,197,94,.55),transparent_19%),radial-gradient(circle_at_68%_46%,rgba(56,189,248,.48),transparent_18%),linear-gradient(135deg,#0d355d,#0a233f)] shadow-2xl">
            <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:38px_38px]" />
            <MapPinned className="absolute left-[24%] top-[28%] size-12 text-emerald-300 drop-shadow-xl" />
            <MapPinned className="absolute left-[62%] top-[46%] size-12 text-amber-300 drop-shadow-xl" />
            <MapPinned className="absolute left-[47%] top-[66%] size-12 text-sky-300 drop-shadow-xl" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/12 bg-[#071d36]/85 p-4 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-amber-300">Бўш ер майдони</p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xl font-extrabold">Termiz industrial zone</p>
                  <p className="mt-1 text-sm text-white/60">Площадь: 2.43 га</p>
                </div>
                <ArrowRight className="size-5 text-amber-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-section mx-auto max-w-[1480px] px-4 py-20 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <article className="premium-news-card overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="grid h-full md:grid-cols-[.9fr_1.1fr]">
              <div className="min-h-[320px] bg-[linear-gradient(145deg,#082f5d,#0b6b8f)] p-7 text-white">
                <Newspaper className="size-11 text-amber-300" />
                <p className="mt-8 text-xs font-bold uppercase tracking-[.2em] text-amber-300">Сўнгги янгиликлар</p>
                <h2 className="mt-3 text-3xl font-black leading-tight">{tx(homeText.newsTitle)}</h2>
                <p className="mt-4 text-sm leading-7 text-white/70">{tx(homeText.newsDesc)}</p>
              </div>
              <div className="flex flex-col justify-between p-7">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-[#0b6b8f]">{tx(homeText.newsDate)}</p>
                  <div className="mt-6 space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="border-b border-slate-100 pb-4">
                        <p className="text-sm font-extrabold text-[#08284f]">Сурхондарёда янги инвестиция ташаббуслари муҳокама қилинди</p>
                        <p className="mt-1 text-xs text-slate-400">Инвестициялар · 2026</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Link to="/news" className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#0b6b8f]">
                  Барча янгиликлар <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </article>

          <article className="premium-project-card rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
            <p className="premium-section-label">Устувор лойиҳа</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[#08284f]">{tx(homeText.projectTitle)}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-500">{tx(homeText.projectDistrict)}</p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">Қиймати</p>
                <p className="mt-2 text-2xl font-black text-[#08284f]">{tx(homeText.projectAmount)}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-emerald-600">Ҳолати</p>
                <p className="mt-2 text-lg font-black text-emerald-700">{tx(homeText.projectStatus)}</p>
              </div>
            </div>
            <Button asChild className="mt-8 h-12 w-full rounded-xl bg-[#072f5f] hover:bg-[#041f41]">
              <Link to="/projects">
                Лойиҳалар каталогини очиш
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-4 pb-20 sm:px-6">
        <div className="premium-cta relative overflow-hidden rounded-[30px] bg-[linear-gradient(120deg,#072f5f,#0b6b8f)] px-6 py-12 text-white shadow-2xl sm:px-10 lg:flex lg:items-center lg:justify-between">
          <div className="absolute -right-16 -top-20 size-72 rounded-full bg-amber-300/12 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="premium-section-label text-amber-300">Инвестор билан мулоқот</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Лойиҳангизни Сурхондарёда амалга оширинг</h2>
            <p className="mt-4 text-sm leading-7 text-white/70">Мутахассисларимиз лойиҳани танлашдан бошлаб ишга туширишгача ҳамроҳлик қилади.</p>
          </div>
          <Button asChild size="lg" className="premium-gold-button relative mt-7 rounded-xl px-7 text-[#08284f] lg:mt-0">
            <Link to="/reception">Онлайн қабулхона <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
