/**
 * State symbols.
 * The flag is drawn to official proportions (2:1).
 * The emblem is loaded from a replaceable file (`/brand/emblem.svg` by default,
 * overridable later from the admin panel) and falls back to a neutral
 * placeholder mark when the file is not present — we never draw an invented
 * coat of arms as the real one.
 */
import { useState } from "react";

export function UzFlag({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 500 250"
      className={className}
      role="img"
      aria-label="Ўзбекистон Республикаси Давлат байроғи"
    >
      <rect width="500" height="250" fill="#1EB53A" />
      <rect width="500" height="167" fill="#FFFFFF" />
      <rect width="500" height="83" fill="#0099B5" />
      <rect y="80" width="500" height="7" fill="#CE1126" />
      <rect y="163" width="500" height="7" fill="#CE1126" />
      <circle cx="95" cy="42" r="26" fill="#FFFFFF" />
      <circle cx="105" cy="42" r="26" fill="#0099B5" />
      <g fill="#FFFFFF">
        {[
          [140, 20],
          [163, 20],
          [186, 20],
          [140, 42],
          [163, 42],
          [186, 42],
          [209, 42],
          [232, 42],
          [163, 64],
          [186, 64],
          [209, 64],
          [232, 64],
        ].map(([cx, cy]) => (
          <path
            key={`${cx}-${cy}`}
            transform={`translate(${cx} ${cy}) scale(0.55)`}
            d="M0-12 2.8-4.1 11.4-4.1 4.5 1 7 9 0 4.2-7 9-4.5 1-11.4-4.1-2.8-4.1Z"
          />
        ))}
      </g>
      <rect width="500" height="250" fill="none" stroke="rgba(0,0,0,.12)" strokeWidth="2" />
    </svg>
  );
}

export function UzEmblem({
  className = "h-11 w-11",
  src = "/brand/emblem.svg",
}: {
  className?: string;
  src?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <img
        src={src}
        alt="Ўзбекистон Республикаси Давлат герби"
        className={`${className} object-contain`}
        onError={() => setFailed(true)}
        loading="eager"
        decoding="async"
      />
    );
  }

  return (
    <span
      className={`${className} inline-flex items-center justify-center rounded-full border border-gold/50 bg-gold/10`}
      role="img"
      aria-label="Давлат герби (файл юкланмаган)"
      title="Герб файлини бошқарув панелидан юкланг"
    >
      <svg viewBox="0 0 48 48" className="size-3/4" aria-hidden="true">
        <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold" />
        <circle cx="24" cy="20" r="6" className="fill-gold" />
        <path d="M10 34c4-6 24-6 28 0" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold" />
      </svg>
    </span>
  );
}
