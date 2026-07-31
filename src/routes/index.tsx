import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, BriefcaseBusiness, Factory, Globe2, Handshake, MapPin, MapPinned,
  Percent, Route as RouteIcon, Users, FileText, Newspaper, Building2,
} from "lucide-react";
import heroImage from "@/assets/hero-surkhandarya.jpg";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { StatCounter } from "@/components/site/StatCounter";
import { Button } from "@/components/ui/button";
import { STATS } from "@/lib/site-config";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Сурхондарё вилояти инвестициялар, саноат ва савдо бошқармаси" }] }),
  component: HomePage,
});

const advantages = [
  [MapPin, "Стратегик жойлашув", "Марказий Осиё ва Афғонистон бозорларига яқин"],
  [RouteIcon, "Халқаро транспорт коридорлари", "Автомобиль, темир йўл ва ҳаво йўллари мавжуд"],
  [Users, "Ёш ва малакали меҳнат ресурслари", "Ишчи кучининг катта қисми ёшлардан иборат"],
  [Percent, "Солиқ имтиёзлари", "Инвесторлар учун кенг солиқ енгилликлари"],
  [MapPinned, "Белгуланган ер участкалари", "Тайёр инфратузилма билан таъминланган майдонлар"],
  [Handshake, "Давлат томонидан қўллаб-қувватлаш", "Ҳукумат ва маҳаллий ҳокимлик ёрдами"],
] as const;

function HomePage() {
  return (
    <SiteLayout>
      <section className="relative isolate overflow-hidden">
        <img src={heroImage} alt="Сурхондарё саноат ҳудуди" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,31,70,.94)_0%,rgba(2,52,94,.78)_48%,rgba(3,57,92,.28)_100%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Инвестициялар —<br />келажак тараққиётининг асоси
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
              Сурхондарё вилояти инвестициялар, саноат ва савдо бошқармасининг расмий портали
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-orange-500 text-white hover:bg-orange-600"><Link to="/investments">Инвестор бўлинг <ArrowRight className="size-4" /></Link></Button>
              <Button asChild size="lg" className="bg-blue-700 text-white hover:bg-blue-800"><Link to="/projects">Инвестицион лойиҳалар</Link></Button>
              <Button asChild size="lg" variant="secondary"><Link to="/land">Ер участкалари</Link></Button>
              <Button asChild size="lg" className="bg-green-600 text-white hover:bg-green-700"><Link to="/reception">Онлайн қабулхона</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-7 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-4 rounded-2xl bg-white p-5 shadow-xl sm:grid-cols-2 lg:grid-cols-5">
          {STATS.slice(0,5).map((stat, index) => {
            const labels = ["Ўзлаштирилган инвестициялар", "Экспорт ҳажми", "Амалга оширилган лойиҳалар", "Яратилган иш ўринлари", "Ҳамкор давлатлар"];
            const units = ["млн АҚШ доллари", "млн АҚШ доллари", "та", "та", "та"];
            return <div key={stat.key} className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-600">{labels[index]}</p>
              <p className="mt-2 text-2xl font-extrabold text-[#073b77]"><StatCounter value={stat.value} /> <span className="text-xs font-medium text-slate-500">{units[index]}</span></p>
              <p className="mt-1 text-xs text-slate-400">2026 йил ҳолатига</p>
            </div>
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center"><h2 className="text-2xl font-extrabold text-[#082e5c] sm:text-3xl">Нега Сурхондарё вилоятига инвестиция киритиш керак?</h2><div className="mx-auto mt-3 h-1 w-14 rounded bg-blue-600" /></div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {advantages.map(([Icon,title,desc]) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <Icon className="mx-auto size-8 text-blue-600" /><h3 className="mt-4 text-sm font-bold text-slate-900">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{desc}</p>
          </article>)}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold text-[#082e5c]">Инвестицион карта</h2><MapPinned className="size-5 text-blue-600" /></div>
          <div className="mt-4 flex min-h-52 items-center justify-center rounded-xl bg-[radial-gradient(circle_at_40%_40%,#dff2e4,transparent_35%),linear-gradient(135deg,#eef6fb,#dbe9f4)]">
            <div className="text-center"><MapPin className="mx-auto size-12 text-blue-600" /><p className="mt-2 text-sm font-semibold text-slate-700">Сурхондарё инвестиция объектлари</p></div>
          </div>
          <Button asChild className="mt-4"><Link to="/map">Картага ўтиш</Link></Button>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold text-[#082e5c]">Сўнгги янгиликлар</h2><Newspaper className="size-5 text-blue-600" /></div>
          <div className="mt-4 rounded-xl bg-slate-50 p-4"><p className="text-xs text-blue-600">30.07.2026 · Иқтисод</p><h3 className="mt-2 font-bold text-slate-900">Сурхондарёда янги инвестиция лойиҳалари муҳокама қилинди</h3><p className="mt-2 text-sm leading-6 text-slate-500">Янги саноат қувватлари ва экспорт имкониятларини кенгайтириш бўйича вазифалар белгиланди.</p></div>
          <Button asChild variant="outline" className="mt-4"><Link to="/news">Барча янгиликлар</Link></Button>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold text-[#082e5c]">Инвестицион лойиҳалар</h2><Factory className="size-5 text-blue-600" /></div>
          <div className="mt-4 rounded-xl bg-slate-50 p-4"><p className="text-xs font-semibold text-blue-600">Саноат</p><h3 className="mt-2 font-bold">Текстиль маҳсулотлари ишлаб чиқариш комплекси</h3><p className="mt-2 text-sm text-slate-500">Шўрчи тумани</p><p className="mt-4 text-xl font-extrabold text-[#082e5c]">25 млн АҚШ доллари</p></div>
          <Button asChild className="mt-4"><Link to="/projects">Батафсил</Link></Button>
        </article>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-blue-600">Расмий ресурслар</p><h2 className="mt-2 text-2xl font-extrabold text-[#082e5c]">Фойдали ҳаволалар</h2></div><FileText className="size-8 text-blue-600" /></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[['Invest.gov.uz','https://invest.gov.uz'],['Surxonstat.uz','https://surxonstat.uz'],['E-auksion.uz','https://e-auksion.uz'],['My.gov.uz','https://my.gov.uz'],['Lex.uz','https://lex.uz']].map(([label,href]) => <a key={href} href={href} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-center text-sm font-bold text-[#073b77] shadow-sm hover:border-blue-400 hover:shadow-md">{label}</a>)}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
