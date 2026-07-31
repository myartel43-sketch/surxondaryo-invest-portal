import { useState } from "react";
import { Droplets, Flame, Landmark, MapPin, Ruler, Zap } from "lucide-react";
import { districts } from "./data";

export function InteractiveMap() {
  const [activeId, setActiveId] = useState(districts[1].id);
  const active = districts.find((d) => d.id === activeId)!;

  const rows = [
    { icon: Ruler, label: "Ер майдони", value: active.land },
    { icon: Zap, label: "Электр қуввати", value: active.power },
    { icon: Flame, label: "Табиий газ", value: active.gas },
    { icon: Droplets, label: "Сув таъминоти", value: active.water },
    { icon: Landmark, label: "Мулк шакли", value: active.ownership },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-secondary/60 p-4 sm:p-6">
        <div className="relative aspect-[4/3] w-full">
          <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Сурхондарё вилояти харитаси">
            <defs>
              <linearGradient id="regionFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="oklch(0.45 0.1 210)" stopOpacity="0.28" />
                <stop offset="100%" stopColor="oklch(0.28 0.08 245)" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            <path
              d="M52 4 L70 10 L82 22 L86 38 L74 52 L70 66 L58 78 L50 94 L38 88 L30 74 L20 60 L16 44 L24 30 L34 18 Z"
              fill="url(#regionFill)"
              stroke="oklch(0.45 0.1 210)"
              strokeWidth="0.7"
              strokeLinejoin="round"
            />
          </svg>

          {districts.map((d) => {
            const isActive = d.id === activeId;
            return (
              <button
                key={d.id}
                onClick={() => setActiveId(d.id)}
                style={{ left: `${d.x}%`, top: `${d.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                aria-label={d.name}
              >
                <span className="relative flex items-center gap-2">
                  <span
                    className={`grid size-7 place-items-center rounded-full transition-all ${
                      isActive
                        ? "gradient-gold scale-125 shadow-lg"
                        : "bg-primary/85 hover:scale-110"
                    }`}
                  >
                    <MapPin className="size-4 text-primary-foreground" />
                  </span>
                  <span
                    className={`hidden whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium sm:inline ${
                      isActive ? "bg-primary text-primary-foreground" : "bg-card/80 text-foreground"
                    }`}
                  >
                    {d.name}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground sm:hidden">
          Нуқтани танланг — маълумот ўнг томонда чиқади
        </p>
      </div>

      <div className="glass rounded-3xl p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          {active.projects} та инвестиция лойиҳаси
        </p>
        <h3 className="mt-2 text-2xl font-bold">{active.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{active.zone}</p>

        <dl className="mt-6 space-y-3">
          {rows.map((r) => (
            <div key={r.label} className="flex items-start gap-3 rounded-2xl bg-secondary/70 p-3">
              <r.icon className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <dt className="text-xs text-muted-foreground">{r.label}</dt>
                <dd className="text-sm font-semibold">{r.value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap gap-2">
          {districts.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveId(d.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                d.id === activeId
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border bg-card hover:bg-secondary"
              }`}
            >
              {d.name.replace(" тумани", "").replace(" шаҳри", "")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
