export default function YouTubeEmbed({ videoId, title }) {
  return (
    <div className="mx-auto rounded-2xl overflow-hidden shadow-lg" style={{ maxWidth: 380 }}>
      <div className="relative" style={{ aspectRatio: "9 / 16" }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}