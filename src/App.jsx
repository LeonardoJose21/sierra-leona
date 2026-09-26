import { useEffect, useRef, useState, useCallback } from "react";
import { SERVICES_META } from "./data/serviceMeta";
import Admin from "./pages/Admin";
import { useSiteContent } from "./hooks/useSiteContent";
import Modal from "./components/Modal";
import { money, formatPhoneCO, formatFollowers } from "./utils/format";
import LangSwitch from "./components/LangSwitch";
import YouTubeEmbed from "./components/YouTubeEmbed";
import { parseYouTubeId } from "./utils/youtube";

// ---- Replace these with your own images from src/assets -------------------
// Drop files with these exact names in src/assets, or edit the paths below.
import heroImg from "./assets/hero.jpg";
import aboutImg from "./assets/about.jpg";
import gallery1 from "./assets/gallery-1.png";
import gallery2 from "./assets/gallery-2.png";
import gallery3 from "./assets/gallery-3.jpg";
import gallery5 from "./assets/gallery-5.png";
import gallery6 from "./assets/gallery-6.jpg";
import gallery7 from "./assets/gallery-7.jpg";
import gallery8 from "./assets/gallery-8.png";
import gallery9 from "./assets/gallery-9.jpg";
import gallery10 from "./assets/gallery-10.jpg";
import gallery11 from "./assets/gallery-11.jpg";
import gallery12 from "./assets/gallery-12.jpg";

import Carousel from "./components/Carousel";
import BookingWidget from "./components/BookingWidget";
import { COPY } from "./Copy";
import LazyVideo from "./components/LazyVideo";

// ---- Business constants ----------------------------------------------------
const PHONE_DISPLAY = "+57 301 608 1833"; // shown in footer only — not admin-editable, not used in any CTA
const GOOGLE_PROFILE_URL = "https://share.google/ACfExejzW4hhLi1cB";
const INSTAGRAM_URL = "https://www.instagram.com/sierra.campestre/";
const INSTAGRAM_HANDLE = "@sierra.campestre";

const REVIEWS = [
  {
    name: "Joseph A Villanueva Z",
    stars: 5,
    url: "https://share.google/Lv2KoIXhtqYM6Pg55",
    es: "Es un buen sitio para compartir con familia y amigos, cerca de la ciudad, y con un excelente precio, la comida espectacular.",
    en: "A great place to spend time with family and friends, close to the city, excellent prices, and the food is spectacular.",
  },
  {
    name: "MIGUEL ACOSTA R",
    stars: 5,
    url: "https://share.google/Ho9XlBeVr5EatCNf0",
    es: "Buen lugar para pasar en familia. Excelente atención.",
    en: "A good place to spend time with family. Excellent service.",
  },
  {
    name: "ricardo obando",
    stars: 4,
    url: "https://share.google/kQ9obscVZ2Y8nvHvM",
    es: "Buen sitio para pasar un día de descanso.",
    en: "A good spot for a relaxing day off.",
  },
  {
    name: "Paula Mejía",
    stars: 5,
    url: "https://share.google/2ews7jyL9W8vjU5JV",
    es: "Muy bueno! El sitio está muy bien organizado, muy limpio y bastante amplio. La piscina está súper, muy fresca y el almuerzo excelente! Carne de muy buena calidad y unos pedazos gigantes. Muy recomendado! Lo único es que por ahí hay un panal de abejitas, entonces puede convertirse en un riesgo. El resto, muy fenomenal.",
    en: "Really good! The place is well organized, very clean and spacious. The pool is great, nice and cool, and lunch was excellent — good quality meat in huge portions. Highly recommended! The only thing is there's a beehive nearby, which can be a bit of a risk. Everything else was great.",
  },
];

// ---- Small building blocks --------------------------------------------------

function MacawMark({ className }) {
  return <img src="logo.png" alt="Sierra Campestre" className={className} />;
}

function Stars({ count, className = "" }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} aria-hidden="true">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          width="15"
          height="15"
          viewBox="0 0 20 20"
          className={i < count ? "star" : "text-ink/15"}
          fill="currentColor"
        >
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6L1.3 7.7l6.1-.6L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

function WhatsAppIcon({ className }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.02 3C9.4 3 4 8.36 4 15c0 2.34.66 4.53 1.8 6.4L4 29l7.8-1.76A11.9 11.9 0 0016.02 27C22.65 27 28 21.65 28 15S22.65 3 16.02 3zm0 21.8c-1.98 0-3.83-.55-5.4-1.5l-.39-.23-4.18.94 1-4.05-.26-.4A9.7 9.7 0 016.2 15c0-5.4 4.4-9.8 9.82-9.8 5.42 0 9.82 4.4 9.82 9.8s-4.4 9.8-9.82 9.8z" />
      <path d="M21.2 17.72c-.28-.14-1.66-.82-1.92-.91-.26-.1-.44-.14-.63.14-.19.28-.72.91-.88 1.1-.16.19-.32.2-.6.07-.28-.14-1.17-.43-2.23-1.38-.82-.73-1.38-1.63-1.54-1.91-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.16.19-.28.28-.47.1-.19.05-.35-.02-.5-.07-.14-.63-1.53-.87-2.1-.23-.55-.46-.47-.63-.48-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.35-.26.28-1 1-1 2.42 0 1.43 1.02 2.82 1.16 3.01.14.19 2 3.06 4.85 4.29.68.29 1.2.47 1.62.6.68.22 1.3.19 1.79.11.55-.08 1.66-.68 1.9-1.33.23-.66.23-1.22.16-1.33-.06-.12-.25-.19-.53-.33z" />
    </svg>
  );
}

// Fires the callback once an element enters the viewport, then unobserves.
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ as: Tag = "div", delay, className = "", children }) {
  const ref = useReveal();
  const delayClass = delay ? `reveal-delay-${delay}` : "";
  return (
    <Tag ref={ref} className={`reveal ${delayClass} ${className}`}>
      {children}
    </Tag>
  );
}

// ---- Main App ---------------------------------------------------------------

export default function App() {
  const [lang, setLang] = useState("es");
  const [content] = useSiteContent();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = COPY[lang];

  const statValues = [
    `${content.googleRating}★`,
    formatFollowers(content.instagramFollowers),
    // money(content.pasadia.adultPrice, lang),
    "100%",
  ];
  const ratingLabel =
    lang === "es"
      ? `${content.googleRating} de 5 · ${content.googleReviewCount} reseñas en Google`
      : `${content.googleRating} de 5 · ${content.googleReviewCount} Google reviews`;
  const phoneDisplay = formatPhoneCO(content.whatsappNumber);
  const heroSubtitle = t.hero.subtitleTemplate.replace(
    "{price}",
    money(content.pasadia.adultPrice, lang),
  );

  // state additions inside App()
  const [activeModal, setActiveModal] = useState(null); // null | "room" | "event"

  // build all WhatsApp links off content.whatsappNumber instead of a hardcoded constant
  const waHref = `https://wa.me/${content.whatsappNumber}?text=${encodeURIComponent(t.whatsapp.message)}`;
  const pasadiaWaHref = `https://wa.me/${content.whatsappNumber}?text="Hola, vengo de la página web. Me gustaría reservar una pasadía en Sierra Campestre`;
  const telHref = `tel:+${content.whatsappNumber}`;

  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  if (route.replace(/\/$/, "") === "/editar") return <Admin />;

  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
    document.title = t.title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", t.description);
  }, [lang, t]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleLang = useCallback(
    () => setLang((l) => (l === "es" ? "en" : "es")),
    [],
  );

  const navItems = [
    { href: "#nosotros", label: t.nav.about },
    { href: "#servicios", label: t.nav.services },
    { href: "#galeria", label: t.nav.gallery },
    { href: "#opiniones", label: t.nav.reviews },
    { href: "#ubicacion", label: t.nav.location },
  ];

  const galleryImages = [
    gallery1,
    gallery2,
    gallery3,
    gallery5,
    gallery6,
    gallery7,
    gallery8,
    gallery9,
    gallery10,
    gallery11,
    gallery12,
  ];

  return (
    <div className="bg-sand text-ink font-body">
      {/* ================= HEADER ================= */}
      <header
        className={`site-header fixed top-0 inset-x-0 z-40 border-b ${
          scrolled
            ? "bg-sand/90 backdrop-blur border-ink/10 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
          <a href="#inicio" className="flex items-center gap-2 shrink-0">
            <MacawMark className="w-auto h-12" />
          </a>

          <div className="flex items-center gap-6 ml-auto">
            <LangSwitch lang={lang} setLang={setLang} />

            <nav className="hidden md:flex items-center gap-7 text-[0.94rem] text-ink-soft">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="link-underline hover:text-ink transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-lagoon text-sand px-4 py-2 text-sm font-medium hover:bg-lagoon-deep transition-colors"
              >
                {t.nav.book}
              </a>
            </div>

            <button
              className="md:hidden p-2 -mr-2 text-ink"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          <div
            className={`mobile-menu md:hidden absolute top-full left-0 right-0 overflow-hidden ${
              menuOpen
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0 pointer-events-none"
            }`}
            style={{ transitionProperty: "max-height, opacity" }}
          >
            <div className="px-5 pb-6 pt-2 flex flex-col gap-4 bg-sand border-b border-ink/10">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-ink-soft text-base"
                >
                  {item.label}
                </a>
              ))}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-lagoon text-sand px-4 py-2 text-sm font-medium"
                >
                  {t.nav.book}
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section id="inicio" className="relative pt-16">
        <div className="relative h-[86vh] min-h-[560px] max-h-[840px] overflow-hidden">
          <img
            src={heroImg}
            alt={
              lang === "es"
                ? "Piscina y zona verde de Sierra Campestre en Santa Marta"
                : "Sierra Campestre pool and green grounds in Santa Marta"
            }
            className="absolute inset-0 w-full h-full object-cover"
            fetchPriority="high"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(11,66,88,0.28) 0%, rgba(11,66,88,0.12) 40%, rgba(22,48,42,0.82) 100%)",
            }}
          />

          <div className="relative h-full mx-auto max-w-6xl px-5 sm:px-8 flex flex-col justify-end pb-14 sm:pb-10">
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-sand/90 backdrop-blur px-3.5 py-1.5 mb-6 text-sm text-ink-soft">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-lagoon"
              >
                <path d="M12 21s-7-6.1-7-11a7 7 0 1114 0c0 4.9-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.6" />
              </svg>
              {t.hero.pill}
            </div>

            <h1 className="font-display text-sand text-[2.6rem] sm:text-6xl lg:text-[4.5rem] leading-[1.02] max-w-3xl">
              {t.hero.title}
            </h1>
            <p className="mt-5 text-sand/90 text-lg sm:text-xl max-w-xl leading-relaxed">
              {heroSubtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-mango text-ink px-6 py-3.5 font-medium hover:bg-mango-deep transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5" />
                {t.hero.ctaPrimary}
              </a>
              <a
                href="#galeria"
                className="inline-flex items-center gap-2 rounded-full border border-sand/50 text-sand px-6 py-3.5 font-medium hover:bg-sand/10 transition-colors"
              >
                {t.hero.ctaSecondary}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ---- Trust bar ---- */}
        <div className="bg-lagoon-deep text-sand">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-7 grid grid-cols-3 gap-4 sm:gap-10">
            {t.stats.map((s, i) => (
              <div
                key={i}
                className={`text-center sm:text-left ${i > 0 ? "border-l border-sand/15 pl-3 sm:pl-8" : ""}`}
              >
                <div className="font-display text-xl sm:text-3xl text-mango">
                  {statValues[i]}
                </div>
                <div className="text-sm text-sand/90 mt-1">{s.label}</div>
                <div className="text-xs text-sand/75 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="nosotros" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <Reveal className="order-2 md:order-1">
            <p className="text-sm font-medium text-leaf">{t.about.kicker}</p>
            <h2 className="font-display text-3xl sm:text-4xl mt-3 max-w-md">
              {t.about.title}
            </h2>
            <p className="mt-6 text-ink-soft leading-relaxed max-w-md">
              {t.about.body}
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center mt-8 rounded-full border-2 border-ink text-ink px-6 py-3 font-medium hover:bg-ink hover:text-sand transition-colors"
            >
              {t.about.cta}
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </Reveal>
          <Reveal delay={1} className="order-1 md:order-2">
            <div className="relative aspect-[4/5] rounded-[1.75rem] overflow-hidden">
              <img
                src={aboutImg}
                alt={
                  lang === "es"
                    ? "Zona de sombra y mesas en Sierra Campestre"
                    : "Shaded seating area at Sierra Campestre"
                }
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section id="servicios" className="py-20 sm:py-28 bg-sand-deep">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="max-w-lg">
            <p className="text-sm font-medium text-leaf">{t.services.kicker}</p>
            <h2 className="font-display text-3xl sm:text-4xl mt-3">
              {t.services.title}
            </h2>
          </Reveal>

          <div className="mt-12 grid sm:grid-cols-3 gap-px bg-ink/10 rounded-2xl overflow-hidden">
            {t.services.items.map((item, i) => {
              const meta = SERVICES_META[i];
              return (
                <Reveal
                  key={item.name}
                  delay={(i % 3) + 1}
                  className="bg-sand-deep overflow-hidden group flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={meta.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-[var(--ease-out-strong)] group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-8 sm:p-10 flex flex-col flex-1">
                    <h3 className="font-display text-xl">{item.name}</h3>
                    <p className="mt-2.5 text-ink-soft leading-relaxed">
                      {item.desc}
                    </p>

                    {item.priceLine && (
                      <p className="mt-4 font-display text-2xl text-lagoon">
                        {item.priceLine}
                      </p>
                    )}

                    <div className="mt-auto pt-6">
                      {meta.ctaType === "modal-pasadia" && (
                        <>
                          <p className="font-display text-2xl text-lagoon">
                            {money(content.pasadia.adultPrice, lang)}{" "}
                            {lang === "es" ? "adultos" : "adults"}
                          </p>
                          {item.note && (
                            <p className="mt-2 inline-block rounded-full bg-mango/20 text-mango-deep text-sm font-semibold px-3 py-1.5">
                              {item.note}
                            </p>
                          )}
                          <button
                            onClick={() => setActiveModal("pasadia")}
                            className="inline-flex items-center justify-center w-full sm:w-auto mt-5 rounded-full bg-lagoon text-sand px-6 py-3 font-medium hover:bg-lagoon-deep transition-colors"
                          >
                            {item.ctaLabel}
                          </button>
                        </>
                      )}
                      {meta.ctaType === "modal-room" && (
                        <>
                          <p className="font-display text-2xl text-lagoon">
                            {lang === "es" ? "Desde" : "From"}{" "}
                            {money(
                              Math.min(...content.rooms.map((r) => r.price)),
                              lang,
                            )}
                            {lang === "es" ? "/noche" : "/night"}
                          </p>
                          {item.note && (
                            <p className="mt-2 text-base text-ink-soft">
                              {item.note}
                            </p>
                          )}
                          <button
                            onClick={() => setActiveModal("room")}
                            className="inline-flex items-center justify-center w-full sm:w-auto mt-5 rounded-full border-2 border-ink text-ink px-6 py-3 font-medium hover:bg-ink hover:text-sand transition-colors"
                          >
                            {item.ctaLabel}
                          </button>
                        </>
                      )}

                      {meta.ctaType === "modal-event" && (
                        <>
                          {item.note && (
                            <p className="text-base text-ink-soft">
                              {item.note}
                            </p>
                          )}
                          <button
                            onClick={() => setActiveModal("event")}
                            className="inline-flex items-center justify-center w-full sm:w-auto mt-5 rounded-full border-2 border-ink text-ink px-6 py-3 font-medium hover:bg-ink hover:text-sand transition-colors"
                          >
                            {item.ctaLabel}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section id="galeria" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="max-w-lg">
            <p className="text-sm font-medium text-leaf">{t.gallery.kicker}</p>
            <h2 className="font-display text-3xl sm:text-4xl mt-3">
              {t.gallery.title}
            </h2>
          </Reveal>

          <Carousel className="mt-12">
            {galleryImages.map((src, i) => (
              <div
                key={i}
                data-carousel-item
                className="snap-start shrink-0 w-[88%] sm:w-[340px] relative overflow-hidden rounded-xl aspect-[4/5]"
              >
                <img
                  src={src}
                  alt={`Sierra Campestre — ${t.gallery.items[i] ?? "foto"}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute bottom-2.5 left-2.5 text-xs text-sand bg-ink/45 backdrop-blur px-2.5 py-1 rounded-full">
                  {t.gallery.items[i]}
                </span>
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-sand-deep">
        <div className="mx-auto max-w-2xl px-5 sm:px-8 text-center">
          <Reveal>
            <p className="text-sm font-medium text-leaf">
              {lang === "es" ? "Míralo en video" : "See it in motion"}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl mt-3">
              {lang === "es"
                ? "Así se vive un día en Sierra Campestre"
                : "This is a day at Sierra Campestre"}
            </h2>
          </Reveal>
          <Reveal delay={1} className="mt-10">
            {/* <YouTubeEmbed
              videoId={parseYouTubeId(content.youtubeUrl)}
              title="Sierra Campestre"
            /> */}
            <LazyVideo
              src="/video/sierra-reel.mp4"
              poster="/video/sierra-reel-poster.jpg"
              title="Sierra Campestre"
              duration={"01:00 min"}
            />
          </Reveal>
        </div>
      </section>

      {/* ================= REVIEWS ================= */}
      <section
        id="opiniones"
        className="py-20 sm:py-28 bg-lagoon-deep text-sand"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="max-w-lg">
            <p className="text-sm font-medium text-mango">{t.reviews.kicker}</p>
            <h2 className="font-display text-3xl sm:text-4xl mt-3">
              {t.reviews.title}
            </h2>
            <div className="flex items-center gap-2 mt-4">
              <Stars count={Math.round(content.googleRating)} />
              <span className="text-sm text-sand/80">{ratingLabel}</span>
            </div>
          </Reveal>

          <Carousel className="mt-12" autoPlayMs={5200}>
            {REVIEWS.map((r, i) => (
              <div
                key={r.name}
                data-carousel-item
                className="snap-start shrink-0 w-[90%] sm:w-[400px] bg-sand/[0.06] border border-sand/15 rounded-2xl p-7"
              >
                <Stars count={r.stars} />
                <p className="mt-4 text-sand/95 leading-relaxed text-[0.97rem]">
                  "{lang === "es" ? r.es : r.en}"
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-medium text-sand/85">
                    {r.name}
                  </span>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-mango link-underline"
                  >
                    {t.reviews.seeThis}
                  </a>
                </div>
              </div>
            ))}
          </Carousel>

          <div className="mt-10 text-center">
            <a
              href={GOOGLE_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sand font-medium link-underline"
            >
              {t.reviews.seeAll}
            </a>
          </div>
        </div>
      </section>

      {/* ================= INSTAGRAM ================= */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal
            className="rounded-[2rem] p-10 sm:p-14 grid md:grid-cols-[1fr_auto] gap-8 items-center"
            style={{
              background:
                "linear-gradient(120deg, var(--color-lagoon-mist), var(--color-sand-deep))",
            }}
          >
            <div>
              <p className="text-sm font-medium text-leaf">
                {t.instagram.kicker}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl mt-3 max-w-md">
                {t.instagram.title}
              </h2>
              <p className="mt-3 text-ink-soft">
                {INSTAGRAM_HANDLE} ·{" "}
                <span className="font-medium text-ink">
                  {content.instagramFollowers.toLocaleString(
                    lang === "es" ? "es-CO" : "en-US",
                  )}
                </span>{" "}
                {t.instagram.followers}
              </p>
            </div>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-ink text-sand px-6 py-3.5 font-medium hover:bg-ink/85 transition-colors justify-self-start md:justify-self-end shrink-0"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.2"
                  cy="6.8"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
              {t.instagram.cta}
            </a>
          </Reveal>
        </div>
      </section>

      {/* ================= LOCATION ================= */}
      <section id="ubicacion" className="py-20 sm:py-28 bg-sand-deep">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 grid md:grid-cols-2 gap-10 items-start">
          <Reveal>
            <p className="text-sm font-medium text-leaf">{t.location.kicker}</p>
            <h2 className="font-display text-3xl sm:text-4xl mt-3">
              {t.location.title}
            </h2>

            <dl className="mt-8 space-y-6">
              <div>
                <dt className="text-sm text-ink-soft">{content.address}</dt>
              </div>
              <div>
                <dt className="text-sm text-ink-soft">{content.hours[lang]}</dt>
              </div>
              <div>
                <dt className="text-sm text-ink-soft">
                  {phoneDisplay} --- +57 300 654 6347
                </dt>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-lagoon text-sand px-5 py-3 text-sm font-medium hover:bg-lagoon-deep transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
                {t.location.whatsapp}
              </a>
              <a
                href={telHref}
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-3 text-sm font-medium hover:border-ink/40 transition-colors"
              >
                {t.location.phone}
              </a>
              <a
                href={GOOGLE_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-3 text-sm font-medium hover:border-ink/40 transition-colors"
              >
                {t.location.mapsCta}
              </a>
            </div>
          </Reveal>

          <Reveal
            delay={1}
            className="rounded-2xl overflow-hidden aspect-[4/3] bg-ink/5"
          >
            {/* DUMMY query — replace with the exact address once confirmed */}
            <iframe
              title="Sierra Campestre — Google Maps"
              src="https://www.google.com/maps?q=Sierra+Campestre+Santa+Marta+Magdalena&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>

      {/* ================= CTA BAND ================= */}
      <section className="py-20 sm:py-24 text-center">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl">
              {t.ctaBand.title}
            </h2>
            <p className="mt-3 text-ink-soft">{t.ctaBand.subtitle}</p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 rounded-full bg-mango text-ink px-7 py-4 font-medium hover:bg-mango-deep transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5" />
              {t.ctaBand.cta}
            </a>
          </Reveal>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-ink text-sand/80 py-14">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 grid sm:grid-cols-[1fr_auto] gap-8 items-start">
          <div>
            <div className="flex items-center gap-2">
              <MacawMark className="w-auto h-10" />
            </div>
            <p className="text-sm mt-3 max-w-xs">{t.footer.tagline}</p>
            <div className="flex items-center gap-4 mt-5">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-sand transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.2"
                    cy="6.8"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="hover:text-sand transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
              <a
                href={GOOGLE_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Maps"
                className="hover:text-sand transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 21s-7-6.1-7-11a7 7 0 1114 0c0 4.9-7 11-7 11z" />
                  <circle cx="12" cy="10" r="2.6" />
                </svg>
              </a>
            </div>
          </div>

          <div className="text-sm space-y-2">
            <div>{PHONE_DISPLAY}</div>
            <div>{t.location.address}</div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-5 sm:px-8 mt-10 pt-6 border-t border-sand/10 text-xs text-sand/65 flex flex-col sm:flex-row gap-2 justify-between">
          <span>
            © {new Date().getFullYear()} Sierra Campestre. {t.footer.rights}
          </span>
          <span>{t.footer.madeNote}</span>
        </div>
      </footer>

      {/* ================= WHATSAPP FLOATING WIDGET ================= */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-button fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 flex items-center"
        aria-label={t.whatsapp.tooltip}
      >
        <span className="wa-tooltip mr-3 hidden sm:block bg-ink text-sand text-sm px-3.5 py-2 rounded-full whitespace-nowrap shadow-lg">
          {t.whatsapp.tooltip}
        </span>
        <span className="relative w-14 h-14">
          <span className="wa-ring" />
          <span className="absolute inset-0 rounded-full bg-whatsapp flex items-center justify-center shadow-lg">
            <WhatsAppIcon className="w-7 h-7 text-white" />
          </span>
        </span>
      </a>

      <Modal
        open={activeModal === "room"}
        onClose={() => setActiveModal(null)}
        title={lang === "es" ? "Reservar habitación" : "Book a room"}
      >
        <BookingWidget
          mode="room"
          rooms={content.rooms}
          lang={lang}
          whatsappNumber={content.whatsappNumber}
          onDone={() => setActiveModal(null)}
        />
      </Modal>

      <Modal
        open={activeModal === "event"}
        onClose={() => setActiveModal(null)}
        title={lang === "es" ? "Cotizar evento" : "Get an event quote"}
      >
        <BookingWidget
          mode="event"
          lang={lang}
          whatsappNumber={content.whatsappNumber}
          onDone={() => setActiveModal(null)}
        />
      </Modal>

      <Modal
        open={activeModal === "pasadia"}
        onClose={() => setActiveModal(null)}
        title={lang === "es" ? "Reservar pasadía" : "Book a day pass"}
      >
        <BookingWidget
          mode="pasadia"
          lang={lang}
          whatsappNumber={content.whatsappNumber}
          adultPrice={content.pasadia.adultPrice}
          childPrice={content.pasadia.childPrice}
          onDone={() => setActiveModal(null)}
        />
      </Modal>
    </div>
  );
}
