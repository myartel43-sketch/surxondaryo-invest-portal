import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/site/PortalPage";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/cabinet")({ component: Page });
function Page() { const { t } = useI18n(); return <PortalPage page="cabinet" title={t("nav.cabinet")} />; }
