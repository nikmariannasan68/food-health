"use client";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

export const THEME_KEY = "food-health:theme";
export const MOTION_KEY = "food-health:reduce-motion";

/** Инлайн-скрипт: применяет тему до отрисовки, чтобы не было «вспышки». */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');if(localStorage.getItem('${MOTION_KEY}')==='1')document.documentElement.classList.add('reduce-motion');}catch(e){}})();`;

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {}
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn btn-ghost btn-icon"
      aria-label={dark ? "Включить светлую тему" : "Включить тёмную тему"}
      aria-pressed={dark ?? undefined}
      data-testid="theme-toggle"
    >
      <Icon name={dark ? "sun" : "moon"} />
    </button>
  );
}

export function MotionToggle() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(document.documentElement.classList.contains("reduce-motion")), []);
  function toggle() {
    const next = !reduced;
    document.documentElement.classList.toggle("reduce-motion", next);
    try {
      localStorage.setItem(MOTION_KEY, next ? "1" : "0");
    } catch {}
    setReduced(next);
  }
  return (
    <button type="button" onClick={toggle} aria-pressed={reduced} className="btn btn-secondary text-sm" data-testid="motion-toggle">
      <Icon name="motion" size={18} />
      {reduced ? "Анимации уменьшены" : "Уменьшить анимации"}
    </button>
  );
}
