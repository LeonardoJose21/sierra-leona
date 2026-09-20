import { useState } from "react";

export default function BookingWidget({ mode, rooms = [], lang = "es", whatsappNumber, onDone }) {
  const isEvent = mode === "event";
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? "");
  const [eventType, setEventType] = useState("cumpleaños");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState("");

  const buildMessage = () => {
    if (isEvent) {
      return lang === "es"
        ? `Hola, vengo de su página web. Quiero cotizar un evento (${eventType}) para el ${date}. Somos aprox. ${guests} personas.`
        : `Hi, I'd like a quote for an event (${eventType}) on ${date}. We are approx. ${guests} people.`;
    }
    const room = rooms.find((r) => r.id === roomId);
    const roomName = room ? room.name[lang] : "";
    return lang === "es"
      ? `Hola, quiero reservar la ${roomName} para el ${date}, ${guests} personas.`
      : `Hi, I'd like to book the ${roomName} for ${date}, ${guests} people.`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) {
      setError(lang === "es" ? "Elige una fecha para continuar." : "Pick a date to continue.");
      return;
    }
    const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildMessage())}`;
    window.open(href, "_blank", "noopener,noreferrer");
    onDone?.();
  };

  return (
    <form onSubmit={handleSubmit}>
      {!isEvent && (
        <div>
          <label className="text-sm text-ink-soft">{lang === "es" ? "Habitación" : "Room"}</label>
          <select value={roomId} onChange={(e) => setRoomId(e.target.value)} className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5">
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name[lang]} — ${r.price.toLocaleString(lang === "es" ? "es-CO" : "en-US")}
              </option>
            ))}
          </select>
        </div>
      )}

      {isEvent && (
        <div>
          <label className="text-sm text-ink-soft">{lang === "es" ? "Tipo de evento" : "Event type"}</label>
          <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5">
            <option value="cumpleaños">{lang === "es" ? "Cumpleaños" : "Birthday"}</option>
            <option value="matrimonio">{lang === "es" ? "Matrimonio" : "Wedding"}</option>
            <option value="empresarial">{lang === "es" ? "Empresarial" : "Corporate"}</option>
            <option value="otro">{lang === "es" ? "Otro" : "Other"}</option>
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="text-sm text-ink-soft">
            {lang === "es" ? "Fecha" : "Date"} <span className="text-mango-deep">*</span>
          </label>
          <input
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
            value={date}
            onChange={(e) => { setDate(e.target.value); setError(""); }}
            className={`mt-1 w-full rounded-lg border px-3 py-2.5 ${error ? "border-red-400" : "border-ink/15"}`}
          />
        </div>
        <div>
          <label className="text-sm text-ink-soft">{lang === "es" ? "Personas" : "Guests"}</label>
          <input type="number" min={1} value={guests} onChange={(e) => setGuests(e.target.value)} className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5" />
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <button type="submit" className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-lagoon text-sand py-3 font-medium hover:bg-lagoon-deep transition-colors">
        {isEvent ? (lang === "es" ? "Cotizar por WhatsApp" : "Get a quote on WhatsApp") : lang === "es" ? "Reservar por WhatsApp" : "Book on WhatsApp"}
      </button>
    </form>
  );
}