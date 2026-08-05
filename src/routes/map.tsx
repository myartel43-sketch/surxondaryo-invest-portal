import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SiteLayout } from "@/components/layout/SiteLayout";
import { PublicInvestmentMap } from "@/components/site/PublicInvestmentMap";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/map")({
  component: MapPage,
});

function MapPage() {
  const { t } = useI18n();

  return (
    <SiteLayout>
      <PageHero
        title={t("nav.map")}
        subtitle="Инвестиция объектлари, ер майдонлари ва саноат зоналарининг интерактив харитаси."
      />
      <div className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6">
        <PublicInvestmentMap />
      </div>
    </SiteLayout>
  );
}
