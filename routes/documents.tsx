import { createFileRoute } from "@tanstack/react-router";
import { DocumentsPage } from "@/components/site/DocumentsPage";
import { PageHero, SiteLayout } from "@/components/layout/SiteLayout";
import { useI18n, transliterateUzbek } from "@/i18n";

export const Route = createFileRoute("/documents")({
  component: Page,
});

function Page() {
  const { lang, t } = useI18n();
  const subtitle = {
    uz: "Админ панель орқали юкланган норматив ҳужжатлар, ҳисоботлар ва файллар.",
    ru: "Нормативные документы, отчёты и файлы, загруженные через административную панель.",
    en: "Regulations, reports and files uploaded through the administration panel.",
    zh: "通过管理面板上传的法规、报告和文件。",
  };
  const text = lang === "uzl"
    ? transliterateUzbek(subtitle.uz)
    : subtitle[lang] ?? subtitle.uz;

  return (
    <SiteLayout>
      <PageHero title={t("nav.documents")} subtitle={text} />
      <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
        <DocumentsPage />
      </section>
    </SiteLayout>
  );
}
