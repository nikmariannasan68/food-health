"use client";
import type { ReactNode } from "react";

/** Кнопка перехода к разделу страницы. Переносит фокус на раздел — удобно для клавиатуры и screen reader. */
export function ScrollButton({ target, children, className = "btn btn-primary", testId }: { target: string; children: ReactNode; className?: string; testId?: string }) {
  return (
    <button
      type="button"
      className={className}
      data-testid={testId}
      onClick={() => {
        const el = document.getElementById(target);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
      }}
    >
      {children}
    </button>
  );
}
