/**
 * Мини-роутер для превью-сборки (одиночный HTML-файл на hash-маршрутах).
 * Нужен только для автотестов и демонстрации без Next.js-сервера; в продакшене работает App Router.
 */
import { useSyncExternalStore } from "react";

export interface Loc {
  path: string;
  search: string;
  anchor: string;
}

function parse(hash: string): Loc {
  const raw = hash.startsWith("#/") ? hash.slice(1) : "/";
  const [pathAndSearch, anchor = ""] = raw.split("#");
  const [path, search = ""] = pathAndSearch.split("?");
  return { path: path.replace(/\/+$/, "") || "/", search, anchor };
}

let current: Loc = typeof window !== "undefined" ? parse(window.location.hash) : { path: "/", search: "", anchor: "" };
let lastRouteHash = typeof window !== "undefined" && window.location.hash.startsWith("#/") ? window.location.hash : "#/";
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  window.addEventListener("hashchange", () => {
    const h = window.location.hash;
    if (h && !h.startsWith("#/")) {
      // Обычный якорь (например, «Перейти к содержанию») — не меняем маршрут.
      const id = decodeURIComponent(h.slice(1));
      history.replaceState(null, "", lastRouteHash);
      const el = document.getElementById(id);
      el?.focus();
      el?.scrollIntoView();
      return;
    }
    lastRouteHash = h || "#/";
    current = parse(lastRouteHash);
    listeners.forEach((l) => l());
  });
}

export function useLocation(): Loc {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => current,
    () => current,
  );
}

function setCurrent(hash: string) {
  lastRouteHash = hash;
  current = parse(hash);
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    if (window.location.hash.startsWith("#/")) setCurrent(window.location.hash);
  });
}

/** Навигация в памяти; адресную строку обновляем, если окружение это позволяет (в песочнице может быть запрещено). */
export function navigate(href: string, replace = false) {
  const target = "#" + (href.startsWith("/") ? href : "/" + href);
  setCurrent(target);
  try {
    if (replace) history.replaceState(null, "", target);
    else history.pushState(null, "", target);
  } catch {
    /* только память */
  }
}
