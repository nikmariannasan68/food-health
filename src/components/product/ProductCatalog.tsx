"use client";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { categoryLabels, getNutrient, products, productsForNutrient, type Category, type NutrientId } from "@/content";
import { normalize } from "@/lib/search";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "./ProductCard";

const FILTERS: ("all" | Category)[] = ["all", "drinks", "fastfood", "sweets", "salty", "processed"];
const NUTRIENTS: NutrientId[] = ["energy", "sugar", "salt", "fat", "satFat", "caffeine", "fiber"];

export function ProductCatalog({ compact = false }: { compact?: boolean }) {
  const params = useSearchParams();
  const nutrientParam = params?.get("nutrient") as NutrientId | null;
  const nutrient = nutrientParam && NUTRIENTS.includes(nutrientParam) ? nutrientParam : null;
  const [filter, setFilter] = useState<"all" | Category>("all");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    let l = products;
    if (filter !== "all") l = l.filter((p) => p.categories.includes(filter));
    if (nutrient) {
      const s = new Set(productsForNutrient(nutrient).map((p) => p.slug));
      l = l.filter((p) => s.has(p.slug));
    }
    const nq = normalize(q);
    if (nq) l = l.filter((p) => normalize(p.name + " " + p.summary).includes(nq));
    return l;
  }, [filter, q, nutrient]);

  return (
    <div>
      {nutrient && (
        <div className="card mb-6 flex flex-col gap-2 border-l-4 p-5" style={{ borderLeftColor: "var(--blue)" }}>
          <p className="eyebrow !text-sci">Компонент питания</p>
          <h2 className="text-xl font-bold">{getNutrient(nutrient).name}</h2>
          <p className="text-muted">{getNutrient(nutrient).explainer}</p>
          {getNutrient(nutrient).guideline && <p className="text-sm font-semibold">{getNutrient(nutrient).guideline}</p>}
          <p className="text-sm text-muted">Ниже — продукты, для которых этот компонент значим.</p>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Фильтр по категориям" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {FILTERS.map((f) => (
            <button key={f} type="button" className="filter-btn shrink-0" aria-pressed={filter === f} onClick={() => setFilter(f)} data-testid={`filter-${f}`}>
              {f === "all" ? "Все продукты" : categoryLabels[f]}
            </button>
          ))}
        </div>
        {!compact && (
          <div className="relative w-full lg:max-w-xs">
            <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <label htmlFor="catalog-search" className="sr-only">Поиск продукта по названию</label>
            <input id="catalog-search" className="input" placeholder="Найти продукт…" value={q} onChange={(e) => setQ(e.target.value)} data-testid="catalog-search" />
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite">Найдено продуктов: {list.length}</p>
      {list.length === 0 ? (
        <div className="card p-10 text-center" data-testid="catalog-empty">
          <p className="text-lg font-bold">В этой категории пока нет продуктов</p>
          <p className="mt-2 text-muted">Каталог пополняется: сначала мы проверяем данные по источникам. Сейчас доступны: {products.map((p) => p.name).join(", ")}.</p>
          <button type="button" className="btn btn-secondary mt-4" onClick={() => { setFilter("all"); setQ(""); }}>Показать все продукты</button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
