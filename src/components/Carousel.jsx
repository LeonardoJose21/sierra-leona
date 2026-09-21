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

const arrowClass =
  "flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-sand/85 backdrop-blur shadow-sm border border-ink/10 hover:border-ink/25 hover:bg-sand active:scale-95 transition-[transform,border-color,background-color] shrink-0 text-ink";
  return (
    <div className={`relative ${className}`}>
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {/* Arrows: always visible (mobile included), same size/position on every use of this component */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1 sm:-mx-5">
        <button type="button" onClick={() => scrollByCard(-1)} aria-label="Anterior" className={`${arrowClass} pointer-events-auto`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <button type="button" onClick={() => scrollByCard(1)} aria-label="Siguiente" className={`${arrowClass} pointer-events-auto`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  );
}