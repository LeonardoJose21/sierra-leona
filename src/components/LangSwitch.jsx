import { useState, useRef, useEffect } from "react";

function ColombiaFlag({ className }) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#FCD116" />
      <rect width="30" height="10" y="10" fill="#003893" />
      <rect width="30" height="5" y="15" fill="#CE1126" />
    </svg>
  );
}

function USFlag({ className }) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#B22234" />
      {[...Array(6)].map((_, i) => (
        <rect key={i} width="30" height="1.54" y={1.54 * (i * 2 + 1)} fill="#fff" />
      ))}
      <rect width="12" height="10.77" fill="#3C3B6E" />
    </svg>
  );
}

const LANGS = [
  { value: "es", label: "ES", Flag: ColombiaFlag },
  { value: "en", label: "EN", Flag: USFlag },
];

export default function LangSwitch({ lang, setLang }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = LANGS.find((l) => l.value === lang) ?? LANGS[0];

  useEffect(() => {
    const onClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative shrink-0 text-xs font-semibold">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-ink/15 px-2.5 py-1.5 hover:border-ink/30 transition-colors"
      >
        <current.Flag className="w-5 h-3.5 rounded-[2px]" />
        {current.label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-1.5 w-28 rounded-xl border border-ink/10 bg-sand shadow-lg overflow-hidden z-50"
        >
          {LANGS.map(({ value, label, Flag }) => (
            <li key={value} role="option" aria-selected={lang === value}>
              <button
                type="button"
                onClick={() => {
                  setLang(value);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-ink/5 transition-colors ${
                  lang === value ? "bg-ink/5" : ""
                }`}
              >
                <Flag className="w-5 h-3.5 rounded-[2px]" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}