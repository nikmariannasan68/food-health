"use client";
import { myths } from "@/content";
import { updateState, useAppState } from "@/lib/storage";
import { Icon } from "@/components/ui/Icon";
import { SourceRefs } from "@/components/ui/SourceList";

const OPTIONS = [
  { v: "myth", label: "Миф" },
  { v: "fact", label: "Факт" },
  { v: "depends", label: "Зависит от обстоятельств" },
] as const;
const verdict = { myth: "Это миф", fact: "Это факт", depends: "Зависит от обстоятельств" } as const;

export function MythCards() {
  const { myths: answers } = useAppState();
  const answeredCount = Object.keys(answers).length;
  const correct = myths.filter((m) => answers[m.id] === m.answer).length;

  return (
    <div>
      <p className="mb-6 text-sm text-muted" aria-live="polite">Отвечено: {answeredCount} из {myths.length} · верно: {correct}
        {answeredCount > 0 && <button type="button" className="ml-3 underline" onClick={() => updateState((s) => ({ ...s, myths: {} }))}>Сбросить</button>}
      </p>
      <div className="grid gap-5 md:grid-cols-2">
        {myths.map((m) => {
          const a = answers[m.id];
          return (
            <article key={m.id} id={m.id} className="card scroll-mt-24 p-6" data-testid="myth-card">
              <p className="eyebrow !text-sci">Утверждение</p>
              <h2 className="mt-2 text-xl font-bold">«{m.statement}»</h2>
              <div role="group" aria-label="Ваш ответ" className="mt-4 flex flex-wrap gap-2">
                {OPTIONS.map((o) => (
                  <button key={o.v} type="button" aria-pressed={a === o.v}
                    onClick={() => updateState((s) => ({ ...s, myths: { ...s.myths, [m.id]: o.v } }))}
                    className={`filter-btn ${a && o.v === m.answer ? "!border-good !bg-good-soft !text-good" : ""}`}
                    data-testid={`myth-${m.id}-${o.v}`}
                  >{o.label}</button>
                ))}
              </div>
              {a && (
                <div className={`animate-pop mt-4 rounded-2xl p-4 ${a === m.answer ? "bg-good-soft" : "bg-warn-soft"}`} role="status">
                  <p className={`flex items-center gap-2 font-bold ${a === m.answer ? "text-good" : "text-warn"}`}>
                    <Icon name={a === m.answer ? "check-circle" : "info"} />
                    {a === m.answer ? "Верно! " : "Не совсем. "}{verdict[m.answer]}
                  </p>
                  <p className="mt-1.5 text-sm">{m.explanation}</p>
                  <SourceRefs ids={m.sourceIds} />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
