export function money(n, lang = "es") {
  return `$${Number(n).toLocaleString(lang === "es" ? "es-CO" : "en-US")}`;
}

export function formatPhoneCO(digits) {
  const d = String(digits).replace(/\D/g, "");
  if (d.startsWith("57") && d.length === 12) {
    return `+57 ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8, 12)}`;
  }
  return `+${d}`;
}

export function formatFollowers(n) {
  const num = Number(n);
  return num >= 1000 ? `${(num / 1000).toFixed(1)}K+` : String(num);
}