import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SiteLayout } from "@/components/layout/SiteLayout";
import { PublicInvestmentMap } from "@/components/site/PublicInvestmentMap";
import { useI18n, transliterateUzbek } from "@/i18n";

export const Route = createFileRoute("/map")({
  component: MapPage,
});

function MapPage() {
  const { lang, t } = useI18n();
  const subtitle = {
    uz: "Админ панелда чизилган ер майдонлари, объектлар, маркерлар ва саноат зоналарининг интерактив харитаси.",
    ru: "Интерактивная карта земельных участков, объектов, маркеров и промышленных зон, нанесённых в административной панели.",
    en: "Interactive map of land plots, objects, markers and industrial zones drawn in the administration panel.",
    zh: "管理面板中绘制的土地、对象、标记和工业区互动地图。",
  };
  const text = lang === "uzl" ? transliterateUzbek(subtitle.uz) : subtitle[lang] ?? subtitle.uz;

  return (
    <SiteLayout>
      <PageHero title={t("nav.map")} subtitle={text} />
      <div className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6">
        <PublicInvestmentMap />
      </div>
    </SiteLayout>
  );
}
