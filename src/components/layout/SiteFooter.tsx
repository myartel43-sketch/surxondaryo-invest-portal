import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Clock,
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Youtube,
} from "lucide-react";
import { useI18n } from "@/i18n";
import { CONTACTS } from "@/lib/site-config";
import {
  DEFAULT_SITE_SETTINGS,
  loadSiteSettings,
  type SiteSettings,
} from "@/lib/site-settings";
import "@/government-premium.css";

const EMBLEM = "https://upload.wikimedia.org/wikipedia/commons/7/77/Emblem_of_Uzbekistan.svg";
const socialMeta = [
  ["facebook", Facebook, "Facebook"],
  ["telegram", Send, "Telegram"],
  ["youtube", Youtube, "YouTube"],
  ["instagram", Instagram, "Instagram"],
  ["linkedin", Linkedin, "LinkedIn"],
] as const;

export function SiteFooter() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    loadSiteSettings().then(setSettings);
  }, []);

  const socials = useMemo(
    () => socialMeta.filter(([key]) => Boolean(settings.socialLinks[key].trim())),
    [settings.socialLinks],
  );

  return (
    <footer className="premium-footer text-white">
      <div className="mx-auto max-w-[1480px] px-4 pt-14 sm:px-6">
        <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.3fr_.85fr_.85fr_1.1fr]">
          <div>
            <div className="flex items-center gap-4">
              <span className="grid size-16 place-items-center rounded-2xl bg-white/95"><img src={EMBLEM} alt="Герб" className="size-14 object-contain" /></span>
              <div>
                <p className="text-base font-black leading-snug">{t("org.short")}</p>
                <p className="mt-1 text-xs text-white/50">{t("org.parent")}</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/58">Сурхондарё вилоятида инвестиция муҳитини яхшилаш, саноатни ривожлантириш ва экспорт салоҳиятини ошириш.</p>
            <div className="mt-6 flex gap-2">
              {socials.map(([key, Icon, title]) => (
                <a key={key} href={settings.socialLinks[key]} target="_blank" rel="noreferrer" title={title} className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/75 transition hover:-translate-y-1 hover:border-amber-300/30 hover:bg-amber-300/10 hover:text-amber-300"><Icon className="size-4" /></a>
              ))}
            </div>
          </div>

          <div>
            <p className="premium-footer-title">Бўлимлар</p>
            <div className="mt-5 grid gap-3 text-sm text-white/58">
              <Link to="/projects" className="hover:text-white">{t("nav.projects")}</Link>
              <Link to="/land" className="hover:text-white">{t("nav.land")}</Link>
              <Link to="/map" className="hover:text-white">{t("nav.map")}</Link>
              <Link to="/news" className="hover:text-white">{t("nav.news")}</Link>
              <Link to="/documents" className="hover:text-white">{t("nav.documents")}</Link>
            </div>
          </div>

          <div>
            <p className="premium-footer-title">Фойдали ҳаволалар</p>
            <div className="mt-5 grid gap-3">
              {settings.usefulLinks.slice(0, 6).map(({ label, url }) => (
                <a key={`${label}-${url}`} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-white/58 hover:text-white">{label}<ExternalLink className="size-3" /></a>
              ))}
            </div>
          </div>

          <div>
            <p className="premium-footer-title">Алоқа</p>
            <div className="mt-5 grid gap-4 text-sm text-white/58">
              <p className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-amber-300" />{t("contacts.address.value")}</p>
              <a href="tel:+998762241415" className="flex gap-3 hover:text-white"><Phone className="size-4 text-amber-300" />{CONTACTS.phones[0]}</a>
              <a href={`mailto:${CONTACTS.email}`} className="flex gap-3 hover:text-white"><Mail className="size-4 text-amber-300" />{CONTACTS.email}</a>
              <p className="flex gap-3"><Clock className="size-4 text-amber-300" />{t("contacts.hours.value")}</p>
            </div>
            <Link to="/contacts" className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-amber-300">Боғланиш <ArrowUpRight className="size-4" /></Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 py-5 text-xs text-white/38 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {t("org.name")}. Барча ҳуқуқлар ҳимояланган.</p>
          <p>Расмий давлат инвестиция портали</p>
        </div>
      </div>
    </footer>
  );
}
