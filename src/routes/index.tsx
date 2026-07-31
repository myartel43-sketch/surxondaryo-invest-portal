import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Factory,
  Globe2,
  Handshake,
  Landmark,
  MapPinned,
  Ship,
  TrendingUp,
} from "lucide-react";
import heroImage from "@/assets/hero-surkhandarya.jpg";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { StatCounter } from "@/components/site/StatCounter";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { STATS } from "@/lib/site-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Сурхондарё вилояти инвестициялар, саноат ва савдо бошқармаси",
      },
      {
        name: "description",
        content:
          "Расмий портал: Сурхондарё вилоятида инвестиция лойиҳалари, эркин ер майдонлари, саноат зоналари ва экспорт имкониятлари.",
      },
      {
        property: "og:title",
        content: "Сурхондарё вилояти инвестициялар, саноат ва савдо бошқармаси",
      },
      {
        property: "og:description",
        content:
          "Инвестиция лойиҳалари, ер майдонлари, саноат ва экспорт бўйича расмий давлат портали.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t } = useI18n();

  const services = [
    { icon: Landmark, title: t("svc.invest.title"), desc: t("svc.invest.desc"), to: "/investments" },
    { icon: Factory, title: t("svc.industry.title"), desc: t("svc.industry.desc"), to: "/industry" },
    { icon: Ship, title: t("svc.trade.title"), desc: t("svc.trade.desc"), to: "/export" },
    { icon: Handshake, title: t("svc.support.title"), desc: t("svc.support.desc"), to: "/services" },
  ];

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="Сурхондарё вилоятидаги замонавий саноат инфратузилмаси"
          className="absolute inset-0 size-full object-cover"
          fetchPriority="high"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(115deg,oklch(0.18_0.06_248/0.94)_0%,oklch(0.22_0.07_240/0.82)_45%,oklch(0.3_0.08_200/0.55)_100%)]"
        />
        <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:min-h-[38rem] lg:py-28">
          <p className="reveal inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-gold backdrop-blur">
            {t("hero.badge")}
          </p>
          <h1
            className="reveal mt-6 max-w-4xl text-3xl font-bold leading-[1.1] text-primary-foreground sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            {t("hero.title")}
          </h1>
          <p
            className="reveal mt-6 max-w-2xl text-sm leading-relaxed text-primary-foreground/85 sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            {t("hero.subtitle")}
          </p>
          <div className="reveal mt-9 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
            <Button asChild size="lg" className="min-h-12 gradient-gold text-[oklch(0.22_0.04_60)] hover:opacity-90">
              <Link to="/investments">
                {t("hero.cta.invest")} <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-h-12 border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground backdrop-blur hover:bg-primary-foreground/20 hover:text-primary-foreground"
            >
              <Link to="/projects">{t("hero.cta.projects")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-h-12 border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground backdrop-blur hover:bg-primary-foreground/20 hover:text-primary-foreground"
            >
              <Link to="/land">{t("hero.cta.land")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-h-12 border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground backdrop-blur hover:bg-primary-foreground/20 hover:text-primary-foreground"
            >
              <Link to="/services">{t("hero.cta.business")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Live statistics */}
      <section className="mx-auto -mt-10 max-w-7xl px-4 sm:px-6">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">{t("stats.title")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("stats.subtitle")}</p>
            </div>
            <TrendingUp className="size-6 text-green" aria-hidden="true" />
          </div>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.key} className="rounded-2xl border border-border bg-card p-5 lift">
                <dt className="text-sm font-medium text-muted-foreground">{t(stat.key)}</dt>
                <dd className="mt-2 flex items-baseline gap-2">
                  <StatCounter value={stat.value} className="text-3xl font-bold text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">{t(stat.unitKey)}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green">
            {t("section.services")}
          </p>
          <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
            {t("section.services.sub")}
          </h2>
        </header>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Link
              key={service.to}
              to={service.to}
              className="lift group flex flex-col rounded-2xl border border-border bg-card p-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="flex size-12 items-center justify-center rounded-xl gradient-brand text-primary-foreground">
                <service.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-base font-semibold text-foreground">{service.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{service.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                {t("common.more")}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Map + export teaser */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="gradient-brand relative overflow-hidden rounded-3xl p-8 text-primary-foreground">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -right-10 size-64 rounded-full bg-gold/20 blur-3xl"
            />
            <MapPinned className="size-7 text-gold" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-bold">{t("section.map")}</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/80">
              {t("section.map.sub")}
            </p>
            <Button asChild className="mt-7 min-h-11 gradient-gold text-[oklch(0.22_0.04_60)] hover:opacity-90">
              <Link to="/map">
                {t("nav.map")} <ArrowRight className="size-4" />
              </Link>
            </Button>
          </article>

          <article className="rounded-3xl border border-border bg-card p-8">
            <Globe2 className="size-7 text-green" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-bold text-foreground">{t("section.export")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("section.export.sub")}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild variant="secondary" className="min-h-11">
                <Link to="/export">{t("nav.export")}</Link>
              </Button>
              <Button asChild variant="outline" className="min-h-11">
                <Link to="/projects">
                  <Building2 className="size-4" /> {t("nav.projects")}
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </section>
    </SiteLayout>
  );
}
