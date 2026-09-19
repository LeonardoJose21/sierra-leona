import { useState, useCallback } from "react";
import { DEFAULT_CONTENT } from "../data/siteContent";

const STORAGE_KEY = "sierra-campestre-content";

function loadContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_CONTENT, ...JSON.parse(raw) } : DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  }
}

export function useSiteContent() {
  const [content, setContent] = useState(loadContent);
  const saveContent = useCallback((next) => {
    setContent(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);
  return [content, saveContent];
}