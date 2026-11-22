"use client";
import { useEffect, useState } from "react";
import { markViewed, useFavorite } from "@/lib/storage";
import { Icon } from "./Icon";

export function FavoriteButton({ itemKey, label }: { itemKey: string; label: string }) {
  const { active, toggle } = useFavorite(itemKey);
  return (
    <button type="button" onClick={toggle} aria-pressed={active} className="btn btn-secondary" data-testid="favorite-btn">
      <Icon name="heart" filled={active} className={active ? "text-risk" : undefined} />
      <span>{active ? "В избранном" : "В избранное"}</span>
      <span className="sr-only">: {label}</span>
    </button>
  );
}

export function ShareButton() {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  async function copy() {
    const url = window.location.href;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
      else {
        const ta = document.createElement("textarea");
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      setState("copied");
    } catch {
      setState("error");
    }
    setTimeout(() => setState("idle"), 2500);
  }
  return (
    <button type="button" onClick={copy} className="btn btn-secondary" data-testid="share-btn">
      <Icon name={state === "copied" ? "check" : "link"} />
      <span aria-live="polite">{state === "copied" ? "Ссылка скопирована" : state === "error" ? "Не удалось скопировать" : "Скопировать ссылку"}</span>
    </button>
  );
}

/** Отмечает материал как просмотренный (история изучения). */
export function TrackView({ itemKey }: { itemKey: string }) {
  useEffect(() => {
    markViewed(itemKey);
  }, [itemKey]);
  return null;
}
