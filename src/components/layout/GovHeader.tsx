import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChevronDown,
  Clock,
  Globe,
  LogIn,
  Mail,
  MapPin,
  Menu,
  MessageSquareText,
  Phone,
  Search,
  X,
} from "lucide-react";
import { UzFlag } from "@/components/brand/StateSymbols";
import { AccessibilityMenu } from "@/components/a11y/AccessibilityMenu";
import { useI18n, LANGS, LANG_META } from "@/i18n";
import { NAV, CONTACTS } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import "@/national-header.css";

const UZBEKISTAN_EMBLEM =
  "https://upload.wikimedia.org/wikipedia/commons/7/77/Emblem_of_Uzbekistan.svg";

function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("header.language")}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-primary-foreground/85 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          <Globe className="size-4" />
          {LANG_META[lang].short}
          <ChevronDown className="size-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGS.map((code) => (
          <DropdownMenuItem
            key={code}
            onSelect={() => setLang(code)}
            className={code === lang ? "font-semibold text-primary" : ""}
          >
            {LANG_META[code].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SiteSearch() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={t("header.search")}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex min-h-9 items-center rounded-full px-3 text-primary-foreground/85 hover:bg-primary-foreground/10"
      >
        <Search className="size-4" />
      </button>

      {open && (
        <form
          className="absolute right-0 top-11 z-50 w-[min(22rem,82vw)] rounded-xl border border-border bg-popover p-2 shadow-xl"
          onSubmit={(event) => {
            event.preventDefault();
            const query = value.trim();
            if (query) {
              window.location.assign(`/search?q=${encodeURIComponent(query)}`);
            }
          }}
        >
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={t("header.search.placeholder")}
              className="h-10 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 text-sm"
            />
            <Button type="submit" size="sm" className="h-10">
              {t("common.search")}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function DesktopNav() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <nav className="hidden items-center gap-1 xl:flex">
      {NAV.map((item) =>
        item.children ? (
          <DropdownMenu key={item.key}>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex min-h-11 items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-accent/50 hover:text-foreground">
                {t(item.key)}
                <ChevronDown className="size-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-56">
              {item.children.map((child) => (
                <DropdownMenuItem key={child.key} asChild>
                  <Link to={child.to}>{t(child.key)}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            key={item.key}
            to={item.to}
            className={`inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-accent/50 ${
              pathname === item.to
                ? "text-primary"
                : "text-foreground/80 hover:text-foreground"
            }`}
          >
            {t(item.key)}
          </Link>
        ),
      )}
    </nav>
  );
}

function MobileNav() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const flat = NAV.flatMap((item) => (item.children ? item.children : [item]));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="min-h-11 min-w-11 xl:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="text-sm font-semibold">{t("header.menu")}</span>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="size-5" />
          </Button>
        </div>
        <nav className="p-2">
          {flat.map((item) => (
            <Link
              key={`${item.key}-${item.to}`}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent/60"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function GovHeader() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50">
      <div className="gradient-brand text-primary-foreground">
        <div className="mx-auto flex max-w-[1480px] flex-wrap items-center gap-3 px-4 py-1.5 sm:px-6">
          <div className="flex items-center gap-2 text-[11px] font-medium tracking-wide text-primary-foreground/90">
            <UzFlag className="h-3.5 w-auto rounded-[2px]" />
            <span className="hidden sm:inline">{t("org.state")}</span>
          </div>

          <div className="hidden items-center gap-4 text-[11px] text-primary-foreground/80 lg:flex">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              Termiz shahar, Tuproqqo‘rg‘on mahallasi, Dilnavo ko‘chasi, 16-v-uy
            </span>
            <a href={`mailto:${CONTACTS.email}`} className="inline-flex items-center gap-1.5 hover:text-white">
              <Mail className="size-3.5" />
              {CONTACTS.email}
            </a>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" />
              Пн–Пт 09:00–18:00
            </span>
          </div>

          <div className="ms-auto flex items-center gap-0.5">
            <a
              href={`tel:${CONTACTS.phones[0].replace(/[^\d+]/g, "")}`}
              className="hidden min-h-9 items-center gap-2 rounded-full px-3 text-xs text-primary-foreground/85 hover:bg-primary-foreground/10 md:inline-flex"
            >
              <Phone className="size-3.5" />
              {CONTACTS.phones[0]}
            </a>
            <SiteSearch />
            <AccessibilityMenu />
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1480px] items-center gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="national-identity group flex min-w-0 items-center gap-3">
            <span className="national-emblem-shell">
              <img
                src={UZBEKISTAN_EMBLEM}
                alt="Ўзбекистон Республикаси Давлат герби"
                className="national-emblem"
              />
            </span>

            <span className="national-title-wrap min-w-0">
              <span className="national-flag-wave" aria-hidden="true">
                <UzFlag className="h-full w-full" />
              </span>
              <span className="national-title-content">
                <span className="block truncate text-[13px] font-extrabold leading-tight text-slate-950 sm:text-[15px] lg:text-[17px]">
                  {t("org.name")}
                </span>
                <span className="mt-1 hidden truncate text-[11px] font-medium leading-tight text-slate-600 md:block">
                  {t("org.parent")}
                </span>
              </span>
            </span>
          </Link>

          <div className="ms-auto flex items-center gap-2">
            <Button asChild variant="secondary" className="hidden min-h-11 lg:inline-flex">
              <Link to="/reception">
                <MessageSquareText className="size-4" />
                {t("nav.reception")}
              </Link>
            </Button>
            <Button asChild className="hidden min-h-11 sm:inline-flex">
              <Link to="/cabinet">
                <LogIn className="size-4" />
                {t("header.login")}
              </Link>
            </Button>
            <MobileNav />
          </div>
        </div>

        <div className="mx-auto hidden max-w-[1480px] px-4 pb-2 sm:px-6 xl:block">
          <DesktopNav />
        </div>
      </div>
    </header>
  );
}
