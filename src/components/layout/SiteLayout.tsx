import type { ReactNode } from "react";
import { GovHeader } from "./GovHeader";
import { SiteFooter } from "./SiteFooter";
import { useI18n } from "@/i18n";

export function SiteLayout({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {t("nav.home")}
      </a>
      <GovHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  title,
  subtitle,
  breadcrumb,
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
}) {
  return (
    <section className="gradient-brand relative overflow-hidden text-primary-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-gold/20 blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        {breadcrumb && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{breadcrumb}</p>
        )}
        <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
