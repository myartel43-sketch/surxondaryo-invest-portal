import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Clock, ExternalLink, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Send, Youtube,
} from "lucide-react";
import { useI18n } from "@/i18n";
import { CONTACTS } from "@/lib/site-config";
import { DEFAULT_SITE_SETTINGS, loadSiteSettings, type SiteSettings } from "@/lib/site-settings";

const socialMeta = [
  ["facebook", Facebook, "Facebook"],
  ["telegram", Send, "Telegram"],
  ["youtube", Youtube, "YouTube"],
  ["instagram", Instagram, "Instagram"],
  ["linkedin", Linkedin, "LinkedIn"],
] as const;

const labels = {
  uz: { useful: "Фойдали ҳаволалар", sections: "Бўлимлар", contact: "Алоқа", rights: "Барча ҳуқуқлар ҳимояланган.", description: "Инвестиция муҳитини яхшилаш, саноатни ривожлантириш ва экспорт салоҳиятини ошириш." },
  ru: { useful: "Полезные ссылки", sections: "Разделы", contact: "Контакты", rights: "Все права защищены.", description: "Улучшение инвестиционного климата, развитие промышленности и повышение экспортного потенциала." },
  en: { useful: "Useful links", sections: "Sections", contact: "Contacts", rights: "All rights reserved.", description: "Improving the investment climate, developing industry and increasing export potential." },
  zh: { useful: "实用链接", sections: "栏目", contact: "联系方式", rights: "版权所有。", description: "改善投资环境、发展工业并提升出口潜力。" },
} as const;

export function SiteFooter() {
  const { t, lang } = useI18n();
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const text = labels[lang];

  useEffect(() => {
    loadSiteSettings().then(setSettings);
    const listener = (event: Event) => {
      const custom = event as CustomEvent<SiteSettings>;
      if (custom.detail) setSettings(custom.detail);
    };
    window.addEventListener("site-settings-updated", listener);
    return () => window.removeEventListener("site-settings-updated", listener);
  }, []);

  const visibleSocials = useMemo(
    () => socialMeta.filter(([key]) => Boolean(settings.socialLinks[key].trim())),
    [settings.socialLinks],
  );

  return (
    <footer className="mt-0 bg-[#032b5b] text-white">
      <div className="mx-auto grid max-w-[1480px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src="/brand/department-logo.png" alt={t("org.short")} className="size-16 object-contain" />
            <div>
              <p className="text-sm font-bold leading-snug">{t("org.short")}</p>
              <p className="mt-1 text-xs text-white/65">{t("org.parent")}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/70">{text.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {visibleSocials.map(([key, Icon, title]) => (
              <a key={key} href={settings.socialLinks[key]} target="_blank" rel="noreferrer" aria-label={title} title={title} className="grid size-10 place-items-center rounded-lg bg-blue-600 text-white transition hover:-translate-y-0.5 hover:bg-blue-500">
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">{text.useful}</h2>
          <ul className="mt-4 space-y-2">
            {settings.usefulLinks.map(({ label, url }) => (
              <li key={`${label}-${url}`}>
                <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-white/75 hover:text-white">
                  {label}<ExternalLink className="size-3" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold">{text.sections}</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li><Link to="/projects" className="hover:text-white">{t("nav.projects")}</Link></li>
            <li><Link to="/land" className="hover:text-white">{t("nav.land")}</Link></li>
            <li><Link to="/documents" className="hover:text-white">{t("nav.documents")}</Link></li>
            <li><Link to="/staff" className="hover:text-white">{t("nav.staff")}</Link></li>
            <li><Link to="/news" className="hover:text-white">{t("nav.news")}</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold">{text.contact}</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0" /><span>{t("contacts.address.value")}</span></li>
            <li className="flex gap-2"><Phone className="mt-0.5 size-4 shrink-0" /><a href="tel:+998762241415">{CONTACTS.phones[0]}</a></li>
            <li className="flex gap-2"><Mail className="mt-0.5 size-4 shrink-0" /><a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a></li>
            <li className="flex gap-2"><Clock className="mt-0.5 size-4 shrink-0" /><span>{t("contacts.hours.value")}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto max-w-[1480px] px-4 py-5 text-center text-xs text-white/55 sm:px-6">
          © {year} {t("org.name")}. {text.rights}
        </div>
      </div>
    </footer>
  );
}
