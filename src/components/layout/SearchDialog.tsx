"use client";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { groupResults, kindLabels, search } from "@/lib/search";

const SUGGESTIONS = ["сахар", "соль", "кофеин", "зубы", "давление", "сон"];

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const results = useMemo(() => search(q), [q]);
  const groups = groupResults(results);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>("a[href], button, input");
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-3 pt-[8vh] backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className="card animate-pop flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden shadow-pop" data-testid="search-dialog">
        <h2 id={titleId} className="sr-only">Поиск по сайту</h2>
        <div className="relative border-b border-line p-3">
          <Icon name="search" className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-muted" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="input"
            placeholder="Продукт, компонент, заболевание, орган…"
            aria-label="Поисковый запрос"
            data-testid="search-input"
          />
          <button type="button" onClick={onClose} className="btn btn-ghost btn-icon absolute right-4 top-1/2 -translate-y-1/2" aria-label="Закрыть поиск">
            <Icon name="x" />
          </button>
        </div>
        <div className="overflow-y-auto p-3" aria-live="polite">
          {q.trim().length < 2 ? (
            <div className="p-3">
              <p className="mb-3 text-sm text-muted">Попробуйте:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className="filter-btn" onClick={() => setQ(s)}>{s}</button>
                ))}
              </div>
            </div>
          ) : groups.length === 0 ? (
            <p className="p-6 text-center text-muted">Ничего не нашлось по запросу «{q}». Попробуйте другое слово.</p>
          ) : (
            groups.map(([kind, list]) => (
              <section key={kind} className="mb-3">
                <h3 className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted">{kindLabels[kind]}</h3>
                <ul>
                  {list.slice(0, 6).map((r) => (
                    <li key={r.kind + r.id}>
                      <Link href={r.href} onClick={onClose} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-surface-2" data-testid="search-result">
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold">{r.title}</span>
                          <span className="block truncate text-sm text-muted">{r.subtitle}</span>
                        </span>
                        <Icon name="chevron-right" size={16} className="shrink-0 opacity-50" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
