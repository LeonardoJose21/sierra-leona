// src/components/LazyVideo.jsx — full replace
import { useState } from "react";

export default function LazyVideo({ src, poster, title, duration }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="mx-auto rounded-2xl overflow-hidden shadow-lg"
      style={{ maxWidth: 380 }}
    >
      <div className="relative" style={{ aspectRatio: "9 / 16" }}>
        {playing ? (
          <video
            controls
            autoPlay
            playsInline
            preload="none"
            poster={poster}
            className="absolute inset-0 w-full h-full object-cover"
            title={title}
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={title ? `Reproducir: ${title}` : "Reproducir video"}
            className="absolute inset-0 w-full h-full group"
          >
            <img
              src={poster}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <span className="absolute inset-0 bg-ink/15 group-hover:bg-ink/25 transition-colors" />


            {/* Big centered play button — primary CTA */}
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="var(--color-ink)"
                >
                  <path d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" />
                </svg>
              </span>
            </span>

            {/* Persistent bottom-left badge — reads as "video" even before hover/interaction */}
            <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-ink/70 backdrop-blur px-2.5 py-1.5">
              <svg width="12" height="12" viewBox="0 0 32 32">
                <polygon points="10,6 26,16 10,26" fill="white" />
              </svg>
              {duration && (
                <span className="text-white text-xs font-medium">
                  {duration}
                </span>
              )}
            </span>

            {/* Fake progress track — reinforces "player", sits at the very bottom edge */}
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-white/25">
              <span className="block h-full w-0 bg-mango" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
