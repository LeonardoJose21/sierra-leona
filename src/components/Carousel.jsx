import { useRef, useEffect, useCallback } from "react";

export default function Carousel({ children, autoPlayMs = 4200, className = "" }) {
  const trackRef = useRef(null);
  const timerRef = useRef(null);

  const scrollByCard = useCallback((dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("[data-carousel-item]");
    const step = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.85;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const restart = () => {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
        atEnd ? track.scrollTo({ left: 0, behavior: "smooth" }) : scrollByCard(1);
      }, autoPlayMs);
    };
    restart();
    track.addEventListener("pointerdown", () => clearInterval(timerRef.current));
    track.addEventListener("pointerup", restart);
    return () => clearInterval(timerRef.current);
  }, [autoPlayMs, scrollByCard]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <button type="button" onClick={() => scrollByCard(-1)} aria-label="Anterior"
        className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-sand shadow-lg items-center justify-center border border-ink/10 hover:border-ink/25 transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6" /></svg>
      </button>
      <button type="button" onClick={() => scrollByCard(1)} aria-label="Siguiente"
        className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-sand shadow-lg items-center justify-center border border-ink/10 hover:border-ink/25 transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
      </button>
    </div>
  );
}