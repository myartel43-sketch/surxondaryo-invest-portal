import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
import { useI18n, transliterateUzbek, type Lang } from "@/i18n";
import { listNews, listProjects, pickLanguage, type NewsItem, type ProjectItem } from "@/lib/content-api";
import { listMapObjects, type MapObject } from "@/lib/map-content-api";
import "@/government-premium.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Сурхондарё вилояти инвестициялар, саноат ва савдо бошқармаси",
    }],
  }),
  component: HomePage,
});

type Copy = Record<Exclude<Lang, "uzl">, string>;

const C = (uz: string, ru: string, en: string, zh: string): Copy => ({
  uz, ru, en, zh,
});

function useCopy() {
  const { lang } = useI18n();
  return (value: Copy) => {
    if (lang === "uzl") return transliterateUzbek(value.uz);
    return value[lang] ?? value.uz;
  };
}

const copy = {
  heroTitle: C(
    "Инвестициялар — келажак тараққиётининг асоси",
    "Инвестиции — основа будущего развития",
    "Investment is the foundation of future growth",
    "投资是未来发展的基础",
  ),
  heroSubtitle: C(
    "Сурхондарё вилояти инвестициялар, саноат ва савдо бошқармасининг расмий инвестиция портали",
    "Официальный инвестиционный портал Управления инвестиций, промышленности и торговли Сурхандарьинской области",
    "Official investment portal of the Surkhandarya Regional Department of Investment, Industry and Trade",
    "苏尔汉河州投资、工业和贸易管理局官方投资门户",
  ),
  becomeInvestor: C("Инвестор бўлинг", "Стать инвестором", "Become an investor", "成为投资者"),
  regionalPotential: C("Ҳудуд имкониятлари", "Возможности региона", "Regional potential", "区域潜力"),
  investmentCenter: C(
    "Жанубий Ўзбекистоннинг инвестиция маркази",
    "Инвестиционный центр юга Узбекистана",
    "Investment center of southern Uzbekistan",
    "乌兹别克斯坦南部投资中心",
  ),
  whyLabel: C("Инвестор учун афзалликлар", "Преимущества для инвестора", "Investor advantages", "投资者优势"),
  whyTitle: C(
    "Нега Сурхондарё вилоятига инвестиция киритиш керак?",
    "Почему стоит инвестировать в Сурхандарьинскую область?",
    "Why invest in Surkhandarya region?",
    "为什么投资苏尔汉河州？",
  ),
  allOpportunities: C("Барча имкониятлар", "Все возможности", "All opportunities", "所有机会"),
  geography: C("Инвестиция географияси", "Инвестиционная география", "Investment geography", "投资地理"),
  mapTitle: C(
    "Админ томонидан белгиланган ер майдонлари",
    "Земельные участки, отмеченные администратором",
    "Land plots marked by the administrator",
    "管理员标注的土地地块",
  ),
  mapDesc: C(
    "Оддий ва спутник харитаси, чизилган майдон чегаралари, автоматик ҳисобланган гектар ва объект ҳақидаги маълумотлар.",
    "Обычная и спутниковая карта, границы нанесённых участков, автоматически рассчитанная площадь и сведения об объектах.",
    "Street and satellite maps, drawn plot boundaries, automatically calculated area and object details.",
    "普通地图和卫星地图、绘制的地块边界、自动计算的面积以及对象信息。",
  ),
  openMap: C("Интерактив харитани очиш", "Открыть интерактивную карту", "Open interactive map", "打开互动地图"),
  noPlots: C("Ҳозирча майдон қўшилмаган", "Участки пока не добавлены", "No plots added yet", "尚未添加地块"),
  latestNews: C("Сўнгги янгиликлар", "Последние новости", "Latest news", "最新消息"),
  allNews: C("Барча янгиликлар", "Все новости", "All news", "所有新闻"),
  featuredProject: C("Устувор лойиҳа", "Приоритетный проект", "Featured project", "重点项目"),
  projectsCatalog: C("Лойиҳалар каталогини очиш", "Открыть каталог проектов", "Open project catalogue", "打开项目目录"),
  noNews: C("Админ орқали янгилик қўшилгандан сўнг шу ерда кўринади.", "После добавления новости через админку она появится здесь.", "News added through the admin panel will appear here.", "通过管理面板添加的新闻将显示在此处。"),
  noProjects: C("Админ орқали лойиҳа қўшилгандан сўнг шу ерда кўринади.", "После добавления проекта через админку он появится здесь.", "Projects added through the admin panel will appear here.", "通过管理面板添加的项目将显示在此处。"),
  value: C("Қиймати", "Стоимость", "Value", "投资额"),
  status: C("Ҳолати", "Статус", "Status", "状态"),
  area: C("Майдон", "Площадь", "Area", "面积"),
};

const advantages = [
  [
    Landmark,
    C("Стратегик жойлашув", "Стратегическое расположение", "Strategic location", "战略位置"),
    C("Марказий Осиё ва Афғонистон бозорларига яқин", "Близость к рынкам Центральной Азии и Афганистана", "Close to Central Asian and Afghan markets", "靠近中亚和阿富汗市场"),
  ],
  [
    Truck,
    C("Халқаро транспорт коридорлари", "Международные транспортные коридоры", "International transport corridors", "国际运输走廊"),
    C("Автомобиль, темир йўл ва ҳаво йўллари мавжуд", "Автомобильные, железнодорожные и воздушные маршруты", "Road, rail and air connections", "公路、铁路和航空连接"),
  ],
  [
    Users,
    C("Ёш ва малакали меҳнат ресурслари", "Молодые и квалифицированные кадры", "Young and skilled workforce", "年轻且熟练的劳动力"),
    C("Ишчи кучининг катта қисми ёшлардан иборат", "Значительную часть рабочей силы составляет молодёжь", "A large share of the workforce is young", "劳动力中青年占比较高"),
  ],
  [
    ShieldCheck,
    C("Солиқ имтиёзлари", "Налоговые льготы", "Tax incentives", "税收优惠"),
    C("Инвесторлар учун кенг солиқ енгилликлари", "Широкий набор льгот для инвесторов", "A broad range of investor incentives", "为投资者提供多种优惠"),
  ],
  [
    MapPinned,
    C("Белгиланган ер участкалари", "Подготовленные земельные участки", "Prepared land plots", "已准备土地"),
    C("Тайёр инфратузилма билан таъминланган майдонлар", "Площадки с готовой инфраструктурой", "Sites with ready infrastructure", "配套基础设施完善的地块"),
  ],
  [
    Handshake,
    C("Давлат томонидан қўллаб-қувватлаш", "Государственная поддержка", "Government support", "政府支持"),
    C("Ҳукумат ва маҳаллий ҳокимлик ёрдами", "Поддержка правительства и местных органов власти", "Support from government and local authorities", "政府及地方机构支持"),
  ],
] as const;

const stats = [
  [TrendingUp, 1413.8, C("Умумий инвестициялар", "Общий объём инвестиций", "Total investment", "投资总额"), C("млн АҚШ доллари", "млн долларов США", "USD million", "百万美元")],
  [Factory, 111, C("Инвестиция лойиҳалари", "Инвестиционные проекты", "Investment projects", "投资项目"), C("та", "ед.", "projects", "个")],
  [Users, 2230, C("Янги иш ўринлари", "Новые рабочие места", "New jobs", "新增就业岗位"), C("та", "мест", "jobs", "个")],
  [Globe2, 24, C("Ҳамкор давлатлар", "Страны-партнёры", "Partner countries", "合作国家"), C("та", "стран", "countries", "个")],
  [Truck, 372.5, C("Экспорт салоҳияти", "Экспортный потенциал", "Export potential", "出口潜力"), C("млн АҚШ доллари", "млн долларов США", "USD million", "百万美元")],
] as const;

function formatDate(value: string, lang: Lang) {
  if (!value) return "";
  try {
    const locale = lang === "ru" ? "ru-RU" : lang === "en" ? "en-GB" : lang === "zh" ? "zh-CN" : "uz-UZ";
    return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
  } catch {
    return value;
  }
}

function HomePage() {
  const { lang, t } = useI18n();
  const tx = useCopy();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [plots, setPlots] = useState<MapObject[]>([]);

  useEffect(() => {
    listNews(true).then(setNews).catch(() => setNews([]));
    listProjects(true).then(setProjects).catch(() => setProjects([]));
    listMapObjects(true).then(setPlots).catch(() => setPlots([]));
  }, []);

  const latest = news.slice(0, 3);
  const featured = projects[0];
  const featuredPlot = useMemo(() => plots[0], [plots]);

  return (
    <SiteLayout>
      <section className="premium-hero relative isolate overflow-hidden">
        <img src={heroImage} alt={tx(copy.heroTitle)} className="absolute inset-0 size-full object-cover" />
        <div className="premium-hero-overlay absolute inset-0" />
        <div className="premium-hero-grid absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto grid min-h-[690px] max-w-[1480px] items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.18fr_.82fr] lg:py-24">
          <div className="max-w-4xl">
            <div className="premium-kicker inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[.22em] text-amber-200 backdrop-blur">
              <Sparkles className="size-4" />
              Surxondaryo Investment Gateway
            </div>

            <h1 className="mt-7 max-w-4xl text-4xl font-black leading-[1.05] text-white sm:text-6xl lg:text-[72px]">
              {tx(copy.heroTitle)}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              {tx(copy.heroSubtitle)}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="premium-gold-button h-13 rounded-xl px-7 text-[#08284f]">
                <Link to="/investments">
                  {tx(copy.becomeInvestor)}
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
          </div>

          <aside className="hidden rounded-[28px] border border-white/15 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-xl lg:block">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-amber-200">{tx(copy.regionalPotential)}</p>
            <h2 className="mt-3 text-2xl font-extrabold">{tx(copy.investmentCenter)}</h2>
            <div className="mt-6 grid gap-3">
              {[
                [Building2, C("Саноат зоналари ва тайёр инфратузилма", "Промышленные зоны и готовая инфраструктура", "Industrial zones and ready infrastructure", "工业区和完善基础设施")],
                [MapPinned, C("Интерактив ер майдонлари харитаси", "Интерактивная карта земельных участков", "Interactive land plot map", "互动土地地图")],
                [Globe2, C("Экспорт бозорларига қулай чиқиш", "Удобный выход на экспортные рынки", "Convenient access to export markets", "便捷进入出口市场")],
                [Handshake, C("Лойиҳани тўлиқ ҳамроҳлик қилиш", "Полное сопровождение проекта", "Full project support", "全程项目支持")],
              ].map(([Icon, label]) => (
                <div key={tx(label as Copy)} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/7 p-4">
                  <span className="grid size-11 place-items-center rounded-xl bg-amber-300/15 text-amber-200">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-sm font-semibold leading-5 text-white/90">{tx(label as Copy)}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-14 max-w-[1480px] px-4 sm:px-6">
        <div className="grid gap-3 rounded-[26px] border border-slate-200/80 bg-white p-4 shadow-[0_30px_80px_-35px_rgba(3,43,91,.45)] sm:grid-cols-2 lg:grid-cols-5">
          {stats.map(([Icon, value, label, unit]) => (
            <article key={tx(label)} className="rounded-2xl px-5 py-5">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-[#072f5f] text-amber-300">
                  <Icon className="size-5" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">2026</span>
              </div>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[.12em] text-slate-500">{tx(label)}</p>
              <p className="mt-2 text-3xl font-black text-[#072f5f]"><StatCounter value={value} /></p>
              <p className="mt-1 text-xs text-slate-400">{tx(unit)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-4 py-20 sm:px-6">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="premium-section-label">{tx(copy.whyLabel)}</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-[#072f5f] sm:text-5xl">{tx(copy.whyTitle)}</h2>
          </div>
          <Link to="/investments" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#0b6b8f] hover:text-[#072f5f]">
            {tx(copy.allOpportunities)}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {advantages.map(([Icon, title, desc], index) => (
            <article key={tx(title)} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-13 place-items-center rounded-2xl bg-[#072f5f] text-amber-300">
                  <Icon className="size-6" />
                </span>
                <span className="text-5xl font-black text-slate-100">0{index + 1}</span>
              </div>
              <h3 className="mt-6 text-xl font-extrabold text-[#08284f]">{tx(title)}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">{tx(desc)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#061f3d] text-white">
        <div className="mx-auto grid max-w-[1480px] gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <p className="premium-section-label text-amber-300">{tx(copy.geography)}</p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">{tx(copy.mapTitle)}</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">{tx(copy.mapDesc)}</p>
            <Button asChild size="lg" className="premium-gold-button mt-8 rounded-xl px-7 text-[#08284f]">
              <Link to="/map">
                {tx(copy.openMap)}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="relative min-h-[390px] overflow-hidden rounded-[30px] border border-white/12 bg-[linear-gradient(145deg,#0d355d,#071d36)] shadow-2xl">
            <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:38px_38px]" />
            {plots.slice(0, 6).map((plot, index) => {
              const positions = [
                ["20%", "24%"], ["65%", "28%"], ["43%", "52%"],
                ["75%", "66%"], ["26%", "70%"], ["51%", "18%"],
              ];
              const [left, top] = positions[index] ?? ["50%", "50%"];
              return (
                <span
                  key={plot.id}
                  className="absolute grid size-12 place-items-center rounded-full border border-white/20 bg-emerald-400/20 text-emerald-300 shadow-[0_0_40px_rgba(52,211,153,.38)] backdrop-blur"
                  style={{ left, top }}
                  title={plot.title_uz}
                >
                  <MapPinned className="size-6" />
                </span>
              );
            })}
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/12 bg-[#071d36]/90 p-5 backdrop-blur">
              {featuredPlot ? (
                <>
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-amber-300">{featuredPlot.category || tx(copy.mapTitle)}</p>
                  <div className="mt-2 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xl font-extrabold">{pickLanguage(featuredPlot, "title", lang)}</p>
                      <p className="mt-1 text-sm text-white/60">{tx(copy.area)}: {Number(featuredPlot.area_ha || 0).toFixed(2)} га</p>
                    </div>
                    <Link to="/map"><ArrowRight className="size-5 text-amber-300" /></Link>
                  </div>
                </>
              ) : (
                <p className="text-sm font-semibold text-white/65">{tx(copy.noPlots)}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-4 py-20 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="grid h-full md:grid-cols-[.75fr_1.25fr]">
              <div className="min-h-[330px] bg-[linear-gradient(145deg,#082f5d,#0b6b8f)] p-7 text-white">
                <Newspaper className="size-11 text-amber-300" />
                <p className="mt-8 text-xs font-bold uppercase tracking-[.2em] text-amber-300">{tx(copy.latestNews)}</p>
                <h2 className="mt-3 text-3xl font-black leading-tight">
                  {latest[0] ? pickLanguage(latest[0], "title", lang) : tx(copy.latestNews)}
                </h2>
                <p className="mt-4 line-clamp-5 text-sm leading-7 text-white/72">
                  {latest[0] ? pickLanguage(latest[0], "description", lang) : tx(copy.noNews)}
                </p>
              </div>

              <div className="flex flex-col justify-between p-7">
                <div className="space-y-4">
                  {latest.length ? latest.map((item) => (
                    <article key={item.id} className="grid grid-cols-[78px_1fr] gap-4 border-b border-slate-100 pb-4 last:border-0">
                      {item.image_url ? (
                        <img src={item.image_url} alt="" className="h-16 w-[78px] rounded-xl object-cover" />
                      ) : (
                        <span className="grid h-16 w-[78px] place-items-center rounded-xl bg-slate-100 text-[#0b6b8f]">
                          <Newspaper className="size-5" />
                        </span>
                      )}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[.12em] text-[#0b6b8f]">{formatDate(item.published_at, lang)}</p>
                        <h3 className="mt-1 line-clamp-2 text-sm font-extrabold text-[#08284f]">{pickLanguage(item, "title", lang)}</h3>
                      </div>
                    </article>
                  )) : (
                    <p className="rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-500">{tx(copy.noNews)}</p>
                  )}
                </div>
                <Link to="/news" className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#0b6b8f]">
                  {tx(copy.allNews)} <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#0b6b8f]">{tx(copy.featuredProject)}</p>
            {featured ? (
              <>
                <h2 className="mt-4 text-3xl font-black leading-tight text-[#072f5f]">{pickLanguage(featured, "title", lang)}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-500">{pickLanguage(featured, "description", lang)}</p>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-slate-400">{tx(copy.value)}</p>
                    <p className="mt-2 text-xl font-black text-[#072f5f]">{featured.amount || "—"}</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-600">{tx(copy.status)}</p>
                    <p className="mt-2 text-xl font-black text-emerald-700">{featured.status || "—"}</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-500">{tx(copy.noProjects)}</p>
            )}
            <Button asChild className="mt-8 w-full rounded-xl bg-[#08366c]">
              <Link to="/projects">{tx(copy.projectsCatalog)} <ArrowRight className="size-4" /></Link>
            </Button>
          </article>
        </div>
      </section>
    </SiteLayout>
  );
}
