import { useEffect, useRef, useState } from "react";

/** Counts up to `value` once the element scrolls into view. */
export function StatCounter({
  value,
  duration = 1600,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce =
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.documentElement.classList.contains("a11y-no-animation"));
    if (reduce) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(Math.round(value * eased));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString("ru-RU")}
    </span>
  );
}
