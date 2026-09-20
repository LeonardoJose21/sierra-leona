import svcPasadia from "../assets/service-pasadia.jpg";
import svcHospedaje from "../assets/service-hospedaje.png";
import svcEventos from "../assets/service-events.jpg";

// ctaType: "whatsapp-pasadia" sends straight to WhatsApp with a prefilled message.
// "modal-room" / "modal-event" open the booking modal (BookingWidget) instead.
export const SERVICES_META = [
  { image: svcPasadia, ctaType: "whatsapp-pasadia" },
  { image: svcHospedaje, ctaType: "modal-room" },
  { image: svcEventos, ctaType: "modal-event" },
];