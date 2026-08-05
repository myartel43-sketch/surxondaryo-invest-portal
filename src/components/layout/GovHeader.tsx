import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChevronDown,
  Clock,
  Eye,
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
import "@/government-premium.css";

const EMBLEM = "https://upload.wikimedia.org/wikipedia/commons/7/77/Emblem_of_Uzbekistan.svg";

function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="premium-top-action">
          <Globe className="size-4" />
          {LANG_META[lang].short}
          <ChevronDown className="size-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGS.map((code) => (
          <DropdownMenuItem key={code} onSelect={() => setLang(code)}>
            {LANG_META[code].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SearchBox() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  return (
    <div className="relative">
      <button className="premium-top-action" onClick={() => setOpen(!open)} aria-label={t("header.search")}>
        <Search className="size-4" />
      </button>
      {open && (
        <form
          className="absolute right-0 top-11 z-50 flex w-[min(24rem,84vw)] gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl"
          onSubmit={(event) => {
            event.preventDefault();
            if (value.trim()) window.location.assign(`/search?q=${encodeURIComponent(value.trim())}`);
          }}
        >
          <input ref={ref} value={value} onChange={(event) => setValue(event.target.value)} placeholder={t("header.search.placeholder")} className="h-10 min-w-0 flex-1 rounded-lg border px-3 text-sm text-slate-900" />
          <Button size="sm" className="h-10">{t("common.search")}</Button>
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
              <button className="premium-nav-link">
                {t(item.key)} <ChevronDown className="size-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-60 rounded-xl border-slate-200 p-2 shadow-xl">
              {item.children.map((child) => (
                <DropdownMenuItem key={child.key} asChild className="rounded-lg">
                  <Link to={child.to}>{t(child.key)}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link key={item.key} to={item.to} className={`premium-nav-link ${pathname === item.to ? "is-active" : ""}`}>
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
        <Button variant="outline" size="icon" className="rounded-xl xl:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[88vw] max-w-sm p-0">
        <div className="flex items-center justify-between border-b p-4">
          <span className="font-extrabold text-[#072f5f]">{t("header.menu")}</span>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}><X /></Button>
        </div>
        <nav className="space-y-1 p-3">
          {flat.map((item) => (
            <Link key={`${item.key}-${item.to}`} to={item.to} onClick={() => setOpen(false)} className="flex min-h-11 items-center rounded-xl px-4 text-sm font-bold text-slate-700 hover:bg-slate-100">
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
    <header className="premium-header sticky top-0 z-50">
      <div className="premium-topbar">
        <div className="mx-auto flex max-w-[1480px] items-center gap-4 px-4 py-2 sm:px-6">
          <div className="flex items-center gap-2 text-[11px] font-bold text-white/85">
            <UzFlag className="h-3.5 w-auto rounded-[2px]" />
            <span className="hidden sm:inline">{t("org.state")}</span>
          </div>
          <div className="hidden items-center gap-5 text-[11px] text-white/65 lg:flex">
            <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" />Termiz shahar, Dilnavo ko‘chasi, 16-v-uy</span>
            <a href={`mailto:${CONTACTS.email}`} className="inline-flex items-center gap-1.5 hover:text-white"><Mail className="size-3.5" />{CONTACTS.email}</a>
            <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5" />Пн–Пт 09:00–18:00</span>
          </div>
          <div className="ms-auto flex items-center gap-1">
            <a href={`tel:${CONTACTS.phones[0].replace(/[^\d+]/g, "")}`} className="premium-top-action hidden md:inline-flex"><Phone className="size-4" />{CONTACTS.phones[0]}</a>
            <SearchBox />
            <AccessibilityMenu />
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1480px] items-center gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <span className="premium-emblem-shell"><img src={EMBLEM} alt="Ўзбекистон Республикаси Давлат герби" className="premium-emblem" /></span>
            <span className="min-w-0">
              <span className="block max-w-[720px] truncate text-sm font-black leading-tight text-[#061f3d] sm:text-base lg:text-[18px]">{t("org.name")}</span>
              <span className="mt-1 hidden truncate text-[11px] font-medium text-slate-500 md:block">{t("org.parent")}</span>
            </span>
          </Link>
          <div className="ms-auto flex items-center gap-2">
            <Button asChild variant="outline" className="hidden h-11 rounded-xl border-slate-200 lg:inline-flex"><Link to="/reception"><MessageSquareText className="size-4" />{t("nav.reception")}</Link></Button>
            <Button asChild className="hidden h-11 rounded-xl bg-[#072f5f] hover:bg-[#041f41] sm:inline-flex"><Link to="/cabinet"><LogIn className="size-4" />{t("header.login")}</Link></Button>
            <MobileNav />
          </div>
        </div>
        <div className="border-t border-slate-100">
          <div className="mx-auto flex max-w-[1480px] items-center justify-between px-4 sm:px-6">
            <DesktopNav />
            <div className="hidden items-center gap-2 py-2 text-xs font-bold text-slate-400 xl:flex"><Eye className="size-4" />Очиқ маълумотлар ва шаффофлик</div>
          </div>
        </div>
      </div>
    </header>
  );
}
