import { useEffect } from "react";

export default function InstagramEmbed({ url }) {
  useEffect(() => {
    const process = () => window.instgrm && window.instgrm.Embeds.process();
    if (window.instgrm) {
      process();
    } else {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = process;
      document.body.appendChild(script);
    }
  }, [url]);

  return (
    <div className="flex justify-center">
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