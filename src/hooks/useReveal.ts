import { useEffect } from "react";

/**
 * Add `data-reveal` to any element to fade+lift it in when it enters the viewport.
 * Optionally set `data-reveal-delay="120"` (ms) for staggered reveals.
 */
export function useReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!els.length) return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = Number(el.dataset.revealDelay || 0);
            if (delay > 0) {
              window.setTimeout(() => el.classList.add("is-revealed"), delay);
            } else {
              el.classList.add("is-revealed");
            }
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
