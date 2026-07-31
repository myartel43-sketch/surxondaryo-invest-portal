import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock, Building2 } from "lucide-react";
import { UzEmblem, UzFlag } from "@/components/brand/StateSymbols";
import { useI18n } from "@/i18n";
import { CONTACTS, NAV } from "@/lib/site-config";

export function SiteFooter() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  const sections = NAV.flatMap((i) => (i.children ? i.children : [i])).slice(0, 10);

  return (
    <footer className="gradient-brand mt-24 text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <UzEmblem className="size-12" />
            <UzFlag className="h-7 w-auto rounded-[3px]" />
          </div>
          <p className="mt-4 max-w-md text-sm font-semibold leading-snug">{t("org.name")}</p>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-primary-foreground/70">
            {t("org.parent")}
          </p>
          <p className="mt-4 flex items-center gap-2 text-xs text-primary-foreground/70">
            <Building2 className="size-4" aria-hidden="true" />
            {t("contacts.stir")}: {CONTACTS.stir}
          </p>
        </div>

        <nav aria-label={t("footer.sections")}>
          <h2 className="text-sm font-semibold text-gold">{t("footer.sections")}</h2>
          <ul className="mt-4 space-y-2">
            {sections.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-gold">{t("section.contacts")}</h2>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{t("contacts.address.value")}</span>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span className="flex flex-col">
                {CONTACTS.phones.map((p) => (
                  <a key={p} href={`tel:${p.replace(/[^\d+]/g, "")}`} className="hover:text-primary-foreground">
                    {p}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a href={`mailto:${CONTACTS.email}`} className="hover:text-primary-foreground">
                {CONTACTS.email}
              </a>
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                {t("contacts.hours.value")}
                <br />
                {t("contacts.lunch")}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5 text-xs text-primary-foreground/65 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {year} {t("org.short")}. {t("footer.rights")}.
          </p>
          <p>{t("footer.note")}</p>
        </div>
      </div>
    </footer>
  );
}
