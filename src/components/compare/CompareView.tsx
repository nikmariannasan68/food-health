"use client";
import Link from "next/link";
import { useState } from "react";
import { getNutrient, products, type NutrientId, type Product } from "@/content";
import { amountMax, fmtAmount } from "@/lib/format";
import { DataStatusBadge } from "@/components/ui/Badges";
import { Icon } from "@/components/ui/Icon";
import { ProductArt } from "@/components/product/ProductArt";

const ROWS: NutrientId[] = ["energy", "sugar", "salt", "fat", "satFat", "caffeine", "fiber"];

function Picker({ value, onChange, label, exclude }: { value: string; onChange: (v: string) => void; label: string; exclude: string }) {
  return (
    <div>
      <label htmlFor={label} className="mb-1.5 block text-sm font-semibold">{label}</label>
      <select id={label} value={value} onChange={(e) => onChange(e.target.value)} className="min-h-12 w-full rounded-xl border border-line bg-surface px-3 font-semibold text-ink" data-testid={`compare-${label === "Первый продукт" ? "a" : "b"}`}>
        {products.map((p) => <option key={p.slug} value={p.slug} disabled={p.slug === exclude}>{p.name}</option>)}
      </select>
    </div>
  );
}

function cell(p: Product, n: NutrientId) {
  return p.nutrients.find((x) => x.nutrient === n);
}

export function CompareView() {
  const [a, setA] = useState(products[0].slug);
  const [b, setB] = useState(products[1]?.slug ?? products[0].slug);
  const A = products.find((p) => p.slug === a)!;
  const B = products.find((p) => p.slug === b)!;
  const mixed = A.unit !== B.unit;

  return (
    <div data-testid="compare-view">
      <div className="card grid gap-4 p-5 sm:grid-cols-2">
        <Picker label="Первый продукт" value={a} onChange={setA} exclude={b} />
        <Picker label="Второй продукт" value={b} onChange={setB} exclude={a} />
      </div>

      {mixed && (
        <p className="mt-4 flex gap-2 rounded-2xl bg-warn-soft p-4 text-sm text-warn" role="note" data-testid="compare-warning">
          <Icon name="alert" className="shrink-0" />
          Вы сравниваете напиток (на 100 мл) и твёрдый продукт (на 100 г). Такое сравнение условно: обычно мы съедаем и выпиваем их в разных количествах.
        </p>
      )}

      <div className="card mt-5 overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <caption className="sr-only">Сравнение состава: {A.name} и {B.name}</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="p-4 text-left text-xs uppercase tracking-wider text-muted">Показатель</th>
              {[A, B].map((p) => (
                <th key={p.slug} scope="col" className="p-4 text-left">
                  <Link href={`/products/${p.slug}`} className="flex items-center gap-3 hover:underline">
                    <ProductArt art={p.art} className="h-12 w-12 shrink-0" animated={false} />
                    <span className="font-bold">{p.name}<span className="block text-xs font-normal text-muted">на {p.unit === "ml" ? "100 мл" : "100 г"}</span></span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((n) => {
              const nut = getNutrient(n);
              const ca = cell(A, n), cb = cell(B, n);
              const ma = amountMax(ca?.per100), mb = amountMax(cb?.per100);
              const scale = Math.max(ma ?? 0, mb ?? 0, 0.0001);
              return (
                <tr key={n} className="border-b border-line last:border-0">
                  <th scope="row" className="p-4 text-left font-semibold">{nut.name}</th>
                  {[{ c: ca, m: ma }, { c: cb, m: mb }].map(({ c, m }, i) => (
                    <td key={i} className="p-4 align-top" data-testid={`cmp-${n}-${i}`}>
                      {c ? (
                        <>
                          <span className="font-bold tabular-nums">{fmtAmount(c.per100, nut.unit)}</span>
                          {m !== null && <span className="meter mt-2 block max-w-[10rem]" aria-hidden><span style={{ width: `${Math.max(2, (m / scale) * 100)}%`, background: i === 0 ? "var(--blue)" : "var(--orange)" }} /></span>}
                          <span className="mt-2 block"><DataStatusBadge status={c.status} /></span>
                        </>
                      ) : (
                        <span className="text-muted">Не указано</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">Ориентировочные значения — типичные диапазоны для категории. Для точного сравнения конкретных товаров используйте их этикетки.</p>
    </div>
  );
}
