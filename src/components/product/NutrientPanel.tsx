"use client";
import { useState } from "react";
import { getNutrient, getSources, type Product } from "@/content";
import { amountMax, amountMid, fmtAmount } from "@/lib/format";
import { DataStatusBadge } from "@/components/ui/Badges";
import { Icon } from "@/components/ui/Icon";

export function NutrientPanel({ product }: { product: Product }) {
  const [basis, setBasis] = useState<"per100" | "perServing">("per100");
  const [open, setOpen] = useState<string | null>(product.keyFactors[0]?.nutrient ?? null);
  const unit100 = product.unit === "ml" ? "100 мл" : "100 г";

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Единица расчёта" className="flex rounded-full border border-line bg-surface p-1">
          <button type="button" className="filter-btn !min-h-9 border-0" aria-pressed={basis === "per100"} onClick={() => setBasis("per100")}>На {unit100}</button>
          <button type="button" className="filter-btn !min-h-9 border-0" aria-pressed={basis === "perServing"} onClick={() => setBasis("perServing")} data-testid="basis-serving">На порцию ({product.serving.label})</button>
        </div>
        <p className="text-xs text-muted">Значения — типичные для категории, не для конкретной марки.</p>
      </div>

      <ul className="grid gap-3">
        {product.nutrients.map((nv) => {
          const n = getNutrient(nv.nutrient);
          const amount = basis === "per100" ? nv.per100 : nv.perServing;
          const mid = amountMid(nv.per100);
          const max = amountMax(nv.per100);
          const pct = mid === null ? 0 : Math.min(100, (mid / n.scaleMax) * 100);
          const pctMax = max === null ? 0 : Math.min(100, (max / n.scaleMax) * 100);
          const isKey = product.keyFactors.some((k) => k.nutrient === nv.nutrient);
          const color = isKey ? (nv.nutrient === "caffeine" ? "var(--blue)" : "var(--orange)") : "var(--green)";
          const expanded = open === nv.nutrient;
          return (
            <li key={nv.nutrient} className={`card p-4 ${isKey ? "ring-1 ring-[color-mix(in_oklab,var(--orange)_30%,transparent)]" : ""}`} data-testid={`nutrient-${nv.nutrient}`}>
              <button type="button" className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 text-left" aria-expanded={expanded} onClick={() => setOpen(expanded ? null : nv.nutrient)}>
                <span className="min-w-[8.5rem] font-bold">
                  {n.name}
                  {isKey && <span className="chip chip-orange ml-2 align-middle !text-[0.7rem]">ключевой</span>}
                </span>
                <span className="order-3 w-full sm:order-none sm:w-auto sm:flex-1">
                  <span className="meter block" aria-hidden>
                    {mid !== null && <span style={{ width: `${pctMax}%`, background: color, opacity: 0.25 }} />}
                    {mid !== null && <span style={{ width: `${pct}%`, background: color }} />}
                  </span>
                </span>
                <span className="ml-auto text-right font-display text-lg font-extrabold tabular-nums" data-testid={`nutrient-value-${nv.nutrient}`}>
                  {amount ? fmtAmount(amount, n.unit) : <span className="text-sm font-semibold text-muted">нет данных на порцию</span>}
                </span>
                <Icon name="chevron-down" size={18} className={`text-muted transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
              {expanded && (
                <div className="animate-pop mt-3 border-t border-line pt-3 text-sm">
                  <div className="mb-2 flex flex-wrap gap-2"><DataStatusBadge status={nv.status} /></div>
                  {nv.note && <p className="mb-2">{nv.note}</p>}
                  <p className="text-muted">{n.explainer}</p>
                  {n.guideline && <p className="mt-2 font-semibold text-sci">{n.guideline}</p>}
                  {getSources(nv.sourceIds).length > 0 && (
                    <p className="mt-2 text-xs text-muted">Источник: {getSources(nv.sourceIds).map((s) => (
                      <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="mr-2 underline decoration-dotted">{s.org}</a>
                    ))}</p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-muted">Шкала — наглядный ориентир относительно «высокого» содержания в продуктах на {unit100}; это не суточная норма. Светлая часть полосы — верхняя граница диапазона.</p>
    </div>
  );
}
