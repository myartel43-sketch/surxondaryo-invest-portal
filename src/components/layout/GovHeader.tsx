import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Phone, Search, X, ChevronDown, LogIn, MessageSquareText, Globe, Mail, MapPin, Clock } from "lucide-react";
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

function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("header.language")}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-primary-foreground/85 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <Globe className="size-4" aria-hidden="true" />
          {LANG_META[lang].short}
          <ChevronDown className="size-3" aria-hidden="true" />
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
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-9 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-primary-foreground/85 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <Search className="size-4" aria-hidden="true" />
      </button>
      {open && (
        <form
          className="absolute right-0 top-11 z-50 w-[min(22rem,80vw)] rounded-xl border border-border bg-popover p-2 shadow-lg"
          onSubmit={(e) => {
            e.preventDefault();
            const q = value.trim();
            if (q) window.location.assign(`/search?q=${encodeURIComponent(q)}`);
          }}
        >
          <label htmlFor="site-search" className="sr-only">
            {t("header.search")}
          </label>
          <div className="flex gap-2">
            <input
              id="site-search"
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t("header.search.placeholder")}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav aria-label={t("header.menu")} className="hidden items-center gap-1 xl:flex">
      {NAV.map((item) =>
        item.children ? (
          <DropdownMenu key={item.key}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {t(item.key)}
                <ChevronDown className="size-3.5" aria-hidden="true" />
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
            className={`inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/50 ${
              pathname === item.to ? "text-primary" : "text-foreground/80 hover:text-foreground"
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
        <Button variant="outline" size="icon" className="min-h-11 min-w-11 xl:hidden" aria-label={t("header.menu")}>
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold">{t("header.menu")}</span>
          <Button variant="ghost" size="icon" aria-label={t("header.close")} onClick={() => setOpen(false)}>
            <X className="size-5" />
          </Button>
        </div>
        <nav aria-label={t("header.menu")} className="p-2">
          {flat.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/60"
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="mt-2 grid gap-2 border-t border-border p-2 pt-3">
            <Button asChild variant="secondary" className="min-h-11 justify-start">
              <Link to="/reception" onClick={() => setOpen(false)}>
                <MessageSquareText className="size-4" /> {t("nav.reception")}
              </Link>
            </Button>
            <Button asChild className="min-h-11 justify-start">
              <Link to="/cabinet" onClick={() => setOpen(false)}>
                <LogIn className="size-4" /> {t("header.login")}
              </Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function GovHeader() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50">
      {/* State bar */}
      <div className="gradient-brand text-primary-foreground">
        <div className="mx-auto flex max-w-[1480px] flex-wrap items-center gap-3 px-4 py-1.5 sm:px-6">
          <div className="flex items-center gap-2 text-[11px] font-medium tracking-wide text-primary-foreground/90">
            <UzFlag className="h-3.5 w-auto rounded-[2px]" />
            <span className="hidden sm:inline">{t("org.state")}</span>
          </div>
          <div className="hidden items-center gap-4 text-[11px] text-primary-foreground/80 lg:flex">
            <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" />Termiz shahar, Tuproqqo‘rg‘on mahallasi, Dilnavo ko‘chasi, 16-v-uy</span>
            <a href={`mailto:${CONTACTS.email}`} className="inline-flex items-center gap-1.5 hover:text-white"><Mail className="size-3.5" />{CONTACTS.email}</a>
            <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5" />{t("contacts.hours.value")}</span>
          </div>
          <div className="ms-auto flex items-center gap-0.5">
            <a
              href={`tel:${CONTACTS.phones[0].replace(/[^\d+]/g, "")}`}
              className="hidden min-h-9 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-primary-foreground/85 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground md:inline-flex"
            >
              <Phone className="size-3.5" aria-hidden="true" />
              {CONTACTS.phones[0]}
            </a>
            <SiteSearch />
            <AccessibilityMenu />
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Identity + navigation */}
      <div className="border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1480px] items-center gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img
              src="/brand/department-logo.png"
              alt="Surxondaryo viloyati investitsiyalar, sanoat va savdo boshqarmasi logotipi"
              className="size-14 shrink-0 object-contain sm:size-16"
            />
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-bold leading-tight text-foreground sm:text-[15px]">
                {t("org.name")}
              </span>
              <span className="mt-0.5 hidden truncate text-[11px] leading-tight text-muted-foreground md:block">
                {t("org.parent")}
              </span>
            </span>
          </Link>

          <div className="ms-auto flex items-center gap-2">
            <Button asChild variant="secondary" className="hidden min-h-11 lg:inline-flex">
              <Link to="/reception">
                <MessageSquareText className="size-4" /> {t("nav.reception")}
              </Link>
            </Button>
            <Button asChild className="hidden min-h-11 sm:inline-flex">
              <Link to="/cabinet">
                <LogIn className="size-4" /> {t("header.login")}
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
