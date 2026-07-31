import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Eye, Minus, Plus, Contrast, Droplet, Zap, Underline, RotateCcw } from "lucide-react";
import { useA11y } from "./AccessibilityProvider";
import { useI18n } from "@/i18n";

export function AccessibilityMenu({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  const a11y = useA11y();

  const rows: { icon: typeof Contrast; label: string; active: boolean; onClick: () => void }[] = [
    { icon: Contrast, label: t("a11y.contrast"), active: a11y.contrast, onClick: () => a11y.toggle("contrast") },
    { icon: Droplet, label: t("a11y.grayscale"), active: a11y.grayscale, onClick: () => a11y.toggle("grayscale") },
    { icon: Zap, label: t("a11y.noAnim"), active: a11y.noAnimation, onClick: () => a11y.toggle("noAnimation") },
    {
      icon: Underline,
      label: t("a11y.underline"),
      active: a11y.underlineLinks,
      onClick: () => a11y.toggle("underlineLinks"),
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={t("header.a11y")}
          className="inline-flex min-h-9 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <Eye className="size-4" aria-hidden="true" />
          {!compact && <span className="hidden lg:inline">{t("header.a11y")}</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <p className="text-sm font-semibold text-foreground">{t("a11y.title")}</p>
        <div className="mt-3 flex items-center justify-between rounded-lg border border-border p-2">
          <span className="text-sm text-muted-foreground">A</span>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" aria-label={t("a11y.fontDown")} onClick={a11y.fontDown}>
              <Minus className="size-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label={t("a11y.fontUp")} onClick={a11y.fontUp}>
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
        <ul className="mt-2 space-y-1">
          {rows.map((row) => (
            <li key={row.label}>
              <button
                type="button"
                onClick={row.onClick}
                aria-pressed={row.active}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent/60"
              >
                <span className="flex items-center gap-2">
                  <row.icon className="size-4 text-muted-foreground" aria-hidden="true" />
                  {row.label}
                </span>
                <span
                  className={
                    row.active
                      ? "rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground"
                      : "rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                  }
                >
                  {row.active ? t("a11y.enable") : t("a11y.disable")}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <Button variant="ghost" className="mt-2 w-full justify-start" onClick={a11y.reset}>
          <RotateCcw className="size-4" /> {t("a11y.reset")}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
