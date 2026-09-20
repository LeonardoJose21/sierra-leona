export function parseYouTubeId(url) {
  if (!url) return "";
  const patterns = [
    /shorts\/([a-zA-Z0-9_-]{11})/,
    /watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return url.length === 11 ? url : "";
}