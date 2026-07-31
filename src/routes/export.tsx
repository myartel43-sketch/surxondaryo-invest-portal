import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/site/PortalPage";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/export")({ component: Page });
function Page() { const { t } = useI18n(); return <PortalPage page="export" title={t("nav.export")} />; }
