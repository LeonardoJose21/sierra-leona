import { useState } from "react";

const WHATSAPP_NUMBER = "573016081833";

export default function BookingWidget({ mode, rooms = [], lang = "es" }) {
  const isEvent = mode === "event";
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? "");
  const [eventType, setEventType] = useState("cumpleaños");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);

  const buildMessage = () => {
    if (isEvent) {
      return lang === "es"
        ? `Hola, quiero cotizar un evento (${eventType}) para el ${date || "[fecha]"}, aprox. ${guests} personas.`
        : `Hi, I'd like a quote for an event (${eventType}) on ${date || "[date]"}, approx. ${guests} people.`;
    }
    const room = rooms.find((r) => r.id === roomId);
    const roomName = room ? room.name[lang] : "";
    return lang === "es"
      ? `Hola, quiero reservar la ${roomName} para el ${date || "[fecha]"}, ${guests} personas.`
      : `Hi, I'd like to book the ${roomName} for ${date || "[date]"}, ${guests} people.`;
  };

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;

  return (
    <div className="bg-white rounded-2xl border border-ink/10 p-6 sm:p-7">
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
          <label className="text-sm text-ink-soft">{lang === "es" ? "Fecha" : "Date"}</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5" />
        </div>
        <div>
          <label className="text-sm text-ink-soft">{lang === "es" ? "Personas" : "Guests"}</label>
          <input type="number" min={1} value={guests} onChange={(e) => setGuests(e.target.value)} className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5" />
        </div>
      </div>

      <a href={href} target="_blank" rel="noopener noreferrer"
        className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-lagoon text-sand py-3 font-medium hover:bg-lagoon-deep transition-colors">
        {isEvent ? (lang === "es" ? "Cotizar por WhatsApp" : "Get a quote on WhatsApp") : lang === "es" ? "Reservar por WhatsApp" : "Book on WhatsApp"}
      </a>
    </div>
  );
}