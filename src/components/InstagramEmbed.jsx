// src/components/InstagramEmbed.jsx — replace file
import { useEffect, useRef } from "react";

export default function InstagramEmbed({ url }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const process = () => window.instgrm?.Embeds?.process();
    if (window.instgrm) {
      process();
    } else if (!document.getElementById("ig-embed-script")) {
      const script = document.createElement("script");
      script.id = "ig-embed-script";
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = process;
      document.body.appendChild(script);
    } else {
      // script tag exists but might not have fired onload yet — retry shortly
      const t = setTimeout(process, 600);
      return () => clearTimeout(t);
    }
  }, [url]);

  return (
    <div ref={containerRef} className="flex justify-center">
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={`${url}?utm_source=ig_embed&utm_campaign=loading`}
        data-instgrm-version="14"
        style={{ background: "#FFF", border: 0, borderRadius: 12, margin: 0, maxWidth: 540, minWidth: 326, width: "100%" }}
      />
    </div>
  );
}