import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";

const REVEAL_SELECTOR = [
  "main section",
  "main article",
  "main .rounded-2xl",
  "main .rounded-3xl",
].join(",");

export function SiteEnhancements() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [showTop, setShowTop] = useState(false);
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    setNavigating(true);
    const timer = window.setTimeout(() => setNavigating(false), 420);
    window.scrollTo({ top: 0, behavior: "auto" });
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("reveal-ready");

    const observed = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -7% 0px",
        threshold: 0.08,
      },
    );

    const register = () => {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((element, index) => {
        if (observed.has(element)) return;
        observed.add(element);
        element.classList.add("reveal-on-scroll");
        (element as HTMLElement).style.setProperty(
          "--reveal-delay",
          `${Math.min(index % 5, 4) * 55}ms`,
        );
        observer.observe(element);
      });
    };

    register();

    const mutationObserver = new MutationObserver(register);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      html.classList.remove("reveal-ready");
    };
  }, [pathname]);

  useEffect(() => {
    const imageErrorHandler = (event: Event) => {
      const image = event.target as HTMLImageElement;
      if (!(image instanceof HTMLImageElement)) return;
      if (image.dataset.fallbackApplied === "true") return;

      image.dataset.fallbackApplied = "true";
      image.alt = image.alt || "Изображение недоступно";
      image.classList.add("site-image-error");
    };

    document.addEventListener("error", imageErrorHandler, true);
    return () => document.removeEventListener("error", imageErrorHandler, true);
  }, []);

  useEffect(() => {
    document.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]').forEach((link) => {
      const rel = new Set((link.rel || "").split(/\s+/).filter(Boolean));
      rel.add("noopener");
      rel.add("noreferrer");
      link.rel = Array.from(rel).join(" ");
    });
  }, [pathname]);

  return (
    <>
      <div
        aria-hidden="true"
        className={`site-route-progress ${navigating ? "is-active" : ""}`}
      />

      <button
        type="button"
        aria-label="Наверх"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`site-back-to-top ${showTop ? "is-visible" : ""}`}
      >
        <ArrowUp className="size-5" />
      </button>
    </>
  );
}
