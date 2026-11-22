import Link from "next/link";
import { getDisease, getNutrient, getOrgan, type Product } from "@/content";
import { Icon } from "@/components/ui/Icon";

/** Цепочка: Продукт → Компонент → Физиологическое воздействие → Возможный риск → Профилактика. */
export function KnowledgeMap({ product }: { product: Product }) {
  const chains = product.effects
    .filter((e) => e.diseaseSlugs.length > 0)
    .slice(0, 4)
    .map((e) => ({ e, disease: getDisease(e.diseaseSlugs[0])! }));

  const STEPS = ["Продукт", "Компонент питания", "Воздействие", "Возможный риск", "Профилактика"];

  return (
    <div>
      <ol className="mb-4 hidden grid-cols-5 gap-3 text-center text-xs font-bold uppercase tracking-wider text-muted md:grid" aria-hidden>
        {STEPS.map((s) => <li key={s}>{s}</li>)}
      </ol>
      <ul className="grid gap-4">
        {chains.map(({ e, disease }) => (
          <li key={e.title} className="card p-3">
            <ol className="grid items-stretch gap-2 md:grid-cols-5" aria-label={`Цепочка связи: ${e.title}`}>
              {[
                { t: product.name, c: "bg-surface-2", step: STEPS[0] },
                { t: getNutrient(e.factor).name, c: "bg-sci-soft text-sci", step: STEPS[1] },
                { t: `${getOrgan(e.organ).name}: ${e.title.toLowerCase()}`, c: "bg-sci-soft text-sci", step: STEPS[2] },
                { t: disease.name, c: "bg-warn-soft text-warn", step: STEPS[3], href: `/diseases/${disease.slug}` },
                { t: "Что делать", c: "bg-good-soft text-good", step: STEPS[4], href: `/prevention?product=${product.slug}` },
              ].map((n, i) => (
                <li key={i} className="relative flex">
                  <div className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold ${n.c}`}>
                    <span className="sr-only">{n.step}: </span>
                    {n.href ? <Link href={n.href} className="hover:underline">{n.t}</Link> : <span>{n.t}</span>}
                  </div>
                  {i < 4 && <Icon name="chevron-right" size={16} className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 text-muted md:block" />}
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">Цепочка упрощённая: каждый шаг зависит от количества, частоты и рациона в целом.</p>
    </div>
  );
}
