import { useState } from "react";
import { useSiteContent } from "../hooks/useSiteContent";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

export default function Admin() {
  const [content, saveContent] = useSiteContent();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [draft, setDraft] = useState(content);
  const [saved, setSaved] = useState(false);

  const update = (path, value) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      let ref = next;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      ref[path[path.length - 1]] = value;
      return next;
    });
  };

  const handleSave = () => {
    saveContent(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center px-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (password === ADMIN_PASSWORD) setAuthed(true);
          }}
          className="w-full max-w-sm bg-white rounded-2xl border border-ink/10 p-8"
        >
          <h1 className="font-display text-2xl">Panel de administración</h1>
          <p className="text-sm text-ink-soft mt-1">Sierra Campestre</p>
          <label className="block mt-6 text-sm text-ink-soft">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-ink/15 px-3.5 py-2.5 outline-none focus:border-lagoon"
            autoFocus
          />
          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-lagoon text-sand py-2.5 font-medium hover:bg-lagoon-deep transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand px-5 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl">Editar contenido</h1>
          <a href="/" className="text-sm text-lagoon link-underline">
            Ver el sitio
          </a>
        </div>

        <section className="mt-8 bg-white rounded-2xl border border-ink/10 p-6">
          <h2 className="font-display text-lg">Pasadía</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm text-ink-soft">
                Precio adulto (COP)
              </label>
              <input
                type="number"
                value={draft.pasadia.adultPrice}
                onChange={(e) =>
                  update(["pasadia", "adultPrice"], Number(e.target.value))
                }
                className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm text-ink-soft">Precio niño (COP)</label>
              <input
                type="number"
                value={draft.pasadia.childPrice}
                onChange={(e) =>
                  update(["pasadia", "childPrice"], Number(e.target.value))
                }
                className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2"
              />
            </div>
          </div>
        </section>

        <section className="mt-6 bg-white rounded-2xl border border-ink/10 p-6">
          <h2 className="font-display text-lg">Habitaciones</h2>
          {draft.rooms.map((room, i) => (
            <div key={room.id} className="mt-4">
              <label className="text-sm text-ink-soft">
                {room.name.es} — precio (COP)
              </label>
              <input
                type="number"
                value={room.price}
                onChange={(e) =>
                  update(["rooms", i, "price"], Number(e.target.value))
                }
                className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2"
              />
            </div>
          ))}
        </section>

        <section className="mt-6 bg-white rounded-2xl border border-ink/10 p-6">
          <h2 className="font-display text-lg">Número de WhatsApp</h2>
          <label className="text-sm text-ink-soft block mt-2">
            Con indicativo de país, sin espacios ni "+" (ej: 573016081833)
          </label>
          <input
            type="text"
            value={draft.whatsappNumber}
            onChange={(e) =>
              update(["whatsappNumber"], e.target.value.replace(/\D/g, ""))
            }
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2"
            placeholder="573016081833"
          />
        </section>

        <section className="mt-6 bg-white rounded-2xl border border-ink/10 p-6">
          <h2 className="font-display text-lg">Instagram & Google</h2>

          <label className="text-sm text-ink-soft block mt-3">
            Seguidores en Instagram
          </label>
          <input
            type="number"
            value={draft.instagramFollowers}
            onChange={(e) =>
              update(["instagramFollowers"], Number(e.target.value))
            }
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2"
          />

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm text-ink-soft">
                Calificación Google (0–5)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={draft.googleRating}
                onChange={(e) =>
                  update(["googleRating"], Number(e.target.value))
                }
                className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm text-ink-soft">Número de reseñas</label>
              <input
                type="number"
                value={draft.googleReviewCount}
                onChange={(e) =>
                  update(["googleReviewCount"], Number(e.target.value))
                }
                className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2"
              />
            </div>
          </div>
        </section>

        <section className="mt-6 bg-white rounded-2xl border border-ink/10 p-6">
          <h2 className="font-display text-lg">Ubicación y horario</h2>

          <label className="text-sm text-ink-soft block mt-3">Dirección</label>
          <input
            type="text"
            value={draft.address}
            onChange={(e) => update(["address"], e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2"
          />

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm text-ink-soft">Horario (ES)</label>
              <input
                type="text"
                value={draft.hours.es}
                onChange={(e) => update(["hours", "es"], e.target.value)}
                className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm text-ink-soft">Hours (EN)</label>
              <input
                type="text"
                value={draft.hours.en}
                onChange={(e) => update(["hours", "en"], e.target.value)}
                className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2"
              />
            </div>
          </div>
        </section>

        <label className="text-sm text-ink-soft block mt-2">
          Link del video (YouTube)
        </label>
        <input
          type="text"
          value={draft.youtubeUrl}
          onChange={(e) => update(["youtubeUrl"], e.target.value)}
          className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2"
          placeholder="https://youtube.com/shorts/..."
        />

        <button
          onClick={handleSave}
          className="mt-8 rounded-full bg-mango text-ink px-8 py-3 font-medium hover:bg-mango-deep transition-colors"
        >
          Guardar cambios
        </button>
        {saved && <span className="ml-4 text-sm text-leaf">Guardado ✓</span>}
      </div>
    </div>
  );
}
