import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { useI18n } from "@/i18n";
import { CONTACTS } from "@/lib/site-config";

const usefulLinks = [
  ["Invest.gov.uz", "https://invest.gov.uz"],
  ["Surxonstat.uz", "https://surxonstat.uz"],
  ["E-auksion.uz", "https://e-auksion.uz"],
  ["My.gov.uz", "https://my.gov.uz"],
  ["Lex.uz", "https://lex.uz"],
] as const;

export function SiteFooter() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-[#032b5b] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src="/brand/department-logo.png" alt="Бошқарма логотипи" className="size-16 object-contain" />
            <div>
              <p className="text-sm font-bold leading-snug">{t("org.short")}</p>
              <p className="mt-1 text-xs text-white/65">Инвестициялар, саноат ва савдо бошқармаси</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/70">
            Инвестиция муҳитини яхшилаш, саноатни ривожлантириш ва экспорт салоҳиятини ошириш.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Фойдали ҳаволалар</h2>
          <ul className="mt-4 space-y-2">
            {usefulLinks.map(([label, href]) => (
              <li key={href}>
                <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-white/75 hover:text-white">
                  {label}<ExternalLink className="size-3" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold">Бўлимлар</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li><Link to="/projects" className="hover:text-white">Инвестиция лойиҳалари</Link></li>
            <li><Link to="/land" className="hover:text-white">Ер майдонлари</Link></li>
            <li><Link to="/documents" className="hover:text-white">Ҳужжатлар</Link></li>
            <li><Link to="/staff" className="hover:text-white">Ходимлар</Link></li>
            <li><Link to="/news" className="hover:text-white">Янгиликлар</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold">Алоқа</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0" /><span>{t("contacts.address.value")}</span></li>
            <li className="flex gap-2"><Phone className="mt-0.5 size-4 shrink-0" /><a href="tel:+998762241415">{CONTACTS.phones[0]}</a></li>
            <li className="flex gap-2"><Mail className="mt-0.5 size-4 shrink-0" /><a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a></li>
            <li className="flex gap-2"><Clock className="mt-0.5 size-4 shrink-0" /><span>{t("contacts.hours.value")}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-white/55 sm:px-6">
          © {year} Сурхондарё вилояти инвестициялар, саноат ва савдо бошқармаси. Барча ҳуқуқлар ҳимояланган.
        </div>
      </div>
    </footer>
  );
}
