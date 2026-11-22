"use client";
import Link from "next/link";
import { useId, useMemo, useState, type KeyboardEvent } from "react";
import {
  diseasesForOrgan, evidenceLabels, getDisease, getOrgan, organs, products,
  type OrganEffect, type OrganId, type Product,
} from "@/content";
import { EvidenceBadge } from "@/components/ui/Badges";
import { SourceRefs } from "@/components/ui/SourceList";
import { Icon } from "@/components/ui/Icon";

/* Геометрия органов (viewBox 0 0 300 560). Порядок важен: мелкие органы рисуются поверх. */
const SHAPES: Record<OrganId, { d: string; label: { x: number; y: number }; stroke?: boolean }> = {
  vessels: { d: "M150 150 V 330 M150 165 C 120 170 100 190 88 250 L 63 325 M150 165 C 180 170 200 190 212 250 L 237 325 M140 330 L 128 520 M160 330 L 172 520 M150 112 V 150", label: { x: 82, y: 300 }, stroke: true },
  bones: { d: "M124 345 q -6 4 -4 10 l 6 70 q -6 6 -2 12 l 4 70 q -4 8 4 10 q 8 -2 6 -10 l -2 -70 q 4 -6 -2 -12 l -2 -70 q 4 -6 -4 -10 Z M176 345 q 6 4 4 10 l -6 70 q 6 6 2 12 l -4 70 q 4 8 -4 10 q -8 -2 -6 -10 l 2 -70 q -4 -6 2 -12 l 2 -70 q -4 -6 4 -10 Z", label: { x: 186, y: 430 } },
  brain: { d: "M118 62 c 0 -26 16 -40 32 -40 s 32 14 32 40 c 0 10 -6 16 -14 16 h -36 c -8 0 -14 -6 -14 -16 Z", label: { x: 150, y: 50 } },
  teeth: { d: "M136 92 h 28 a 4 4 0 0 1 4 4 v 4 a 4 4 0 0 1 -4 4 h -28 a 4 4 0 0 1 -4 -4 v -4 a 4 4 0 0 1 4 -4 Z", label: { x: 150, y: 98 } },
  liver: { d: "M108 222 c 10 -14 44 -16 58 -6 c 6 6 2 18 -8 22 c -16 8 -34 14 -46 10 c -8 -4 -10 -18 -4 -26 Z", label: { x: 128, y: 232 } },
  stomach: { d: "M168 222 c 18 -6 34 6 32 26 c -2 20 -20 32 -36 26 c -8 -4 -4 -12 2 -14 c 10 -4 14 -14 6 -22 c -6 -6 -10 -14 -4 -16 Z", label: { x: 182, y: 248 } },
  kidneys: { d: "M112 268 c -10 4 -12 26 0 32 c 10 4 14 -6 12 -14 c -2 -8 4 -12 0 -16 c -4 -4 -8 -4 -12 -2 Z M188 268 c 10 4 12 26 0 32 c -10 4 -14 -6 -12 -14 c 2 -8 -4 -12 0 -16 c 4 -4 8 -4 12 -2 Z", label: { x: 150, y: 296 } },
  pancreas: { d: "M128 278 c 14 -8 40 -10 54 -4 c 6 4 2 10 -4 10 c -16 0 -34 4 -46 2 c -8 -2 -8 -6 -4 -8 Z", label: { x: 156, y: 280 } },
  intestine: { d: "M118 304 h 64 a 10 10 0 0 1 10 10 v 30 a 10 10 0 0 1 -10 10 h -64 a 10 10 0 0 1 -10 -10 v -30 a 10 10 0 0 1 10 -10 Z", label: { x: 150, y: 330 } },
  heart: { d: "M160 176 c 6 -10 22 -8 22 6 c 0 14 -22 26 -22 26 s -22 -12 -22 -26 c 0 -14 16 -16 22 -6 Z", label: { x: 160, y: 190 } },
};
const ORDER: OrganId[] = ["vessels", "bones", "brain", "liver", "stomach", "intestine", "kidneys", "pancreas", "heart", "teeth"];

const strength = (e: OrganEffect) => (e.confidence === "high" ? 3 : e.confidence === "moderate" ? 2 : 1);

interface Props {
  /** Если задан — показываем связи только этого продукта; иначе — переключатель продуктов. */
  productSlug?: string;
  initialOrgan?: OrganId;
  preventionHref?: string;
}

export function BodyMap({ productSlug, initialOrgan, preventionHref }: Props) {
  const [picked, setPicked] = useState<string>(productSlug ?? "all");
  const [selected, setSelected] = useState<OrganId | null>(initialOrgan ?? null);
  const [hover, setHover] = useState<OrganId | null>(null);
  const titleId = useId();

  const activeProducts: Product[] = picked === "all" ? products : products.filter((p) => p.slug === picked);
  const effectsByOrgan = useMemo(() => {
    const m = new Map<OrganId, { product: Product; effect: OrganEffect }[]>();
    for (const p of activeProducts) for (const e of p.effects) {
      if (!m.has(e.organ)) m.set(e.organ, []);
      m.get(e.organ)!.push({ product: p, effect: e });
    }
    return m;
  }, [activeProducts]);

  const level = (id: OrganId) => Math.max(0, ...(effectsByOrgan.get(id)?.map((x) => strength(x.effect)) ?? [0]));

  function onKey(e: KeyboardEvent, id: OrganId) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelected(id);
    }
  }

  const sel = selected ? getOrgan(selected) : null;
  const selEffects = selected ? effectsByOrgan.get(selected) ?? [] : [];
  const relatedDiseases = selected
    ? [...new Set(selEffects.flatMap((x) => x.effect.diseaseSlugs))].map(getDisease).filter(Boolean)
    : [];
  const otherDiseases = selected ? diseasesForOrgan(selected).filter((d) => !relatedDiseases.some((r) => r?.slug === d.slug)) : [];
  const tooltipOrgan = hover ?? null;
  const prevHref = preventionHref ?? (picked !== "all" ? `/prevention?product=${picked}` : "/prevention");

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]" data-testid="body-map">
      <div>
        {!productSlug && (
          <div role="group" aria-label="Выберите продукт" className="mb-4 flex flex-wrap gap-2">
            <button type="button" className="filter-btn" aria-pressed={picked === "all"} onClick={() => setPicked("all")}>Все продукты</button>
            {products.map((p) => (
              <button key={p.slug} type="button" className="filter-btn" aria-pressed={picked === p.slug} onClick={() => setPicked(p.slug)} data-testid={`body-pick-${p.slug}`}>{p.name}</button>
            ))}
          </div>
        )}

        <div className="card relative overflow-hidden p-4">
          <h3 id={titleId} className="sr-only">Интерактивная модель тела</h3>
          <svg viewBox="0 0 300 560" className="mx-auto block h-auto w-full max-w-[340px]" role="group" aria-labelledby={titleId}>
            <defs>
              <linearGradient id="body-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--surface-2)" />
                <stop offset="1" stopColor="color-mix(in oklab, var(--surface-2) 70%, var(--border))" />
              </linearGradient>
            </defs>
            {/* силуэт */}
            <g fill="url(#body-fill)" stroke="var(--border)" strokeWidth="2">
              <circle cx="150" cy="70" r="48" />
              <rect x="136" y="108" width="28" height="30" rx="10" />
              <rect x="62" y="146" width="26" height="196" rx="13" transform="rotate(5 75 146)" />
              <rect x="212" y="146" width="26" height="196" rx="13" transform="rotate(-5 225 146)" />
              <rect x="110" y="330" width="38" height="212" rx="18" />
              <rect x="152" y="330" width="38" height="212" rx="18" />
              <path d="M104 138 Q150 126 196 138 Q216 148 214 190 L206 300 Q202 350 186 356 L114 356 Q98 350 94 300 L86 190 Q84 148 104 138 Z" />
            </g>

            {ORDER.map((id) => {
              const s = SHAPES[id];
              const lv = level(id);
              const isSel = selected === id;
              const color = lv >= 3 ? "var(--red)" : lv === 2 ? "var(--orange)" : lv === 1 ? "var(--blue)" : "var(--muted)";
              const organ = getOrgan(id);
              const status = lv > 0 ? "есть связь с выбранными продуктами" : "связей не найдено";
              return (
                <g
                  key={id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${organ.name}: ${status}`}
                  aria-pressed={isSel}
                  data-organ={id}
                  data-level={lv}
                  className="cursor-pointer outline-none"
                  onClick={() => setSelected(id)}
                  onKeyDown={(e) => onKey(e, id)}
                  onMouseEnter={() => setHover(id)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(id)}
                  onBlur={() => setHover(null)}
                >
                  {s.stroke ? (
                    <>
                      <path d={s.d} stroke="transparent" strokeWidth="16" fill="none" />
                      <path d={s.d} stroke={color} strokeWidth={isSel ? 6 : 4} strokeLinecap="round" fill="none" opacity={lv ? 0.85 : 0.35} className={lv && !isSel ? "organ-active" : undefined} />
                    </>
                  ) : (
                    <path
                      d={s.d}
                      fill={color}
                      fillOpacity={lv ? 0.55 : 0.18}
                      stroke={isSel ? "var(--blue)" : color}
                      strokeWidth={isSel ? 4 : 1.5}
                      className={lv && !isSel ? "organ-active" : undefined}
                    />
                  )}
                  {(isSel || hover === id) && !s.stroke && (
                    <circle cx={s.label.x} cy={s.label.y} r="3" fill="var(--text)" />
                  )}
                </g>
              );
            })}
          </svg>

          {tooltipOrgan && (
            <div className="pointer-events-none absolute left-3 top-3 max-w-[220px] rounded-xl bg-ink px-3 py-2 text-sm text-bg shadow-pop" role="status">
              <strong>{getOrgan(tooltipOrgan).name}</strong>
              <span className="block text-xs opacity-80">{level(tooltipOrgan) ? "Нажмите, чтобы узнать о связи" : "Связей с выбранными продуктами не найдено"}</span>
            </div>
          )}

          <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted" aria-label="Обозначения">
            <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: "var(--red)", opacity: 0.7 }} />Высокая уверенность в связи</li>
            <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: "var(--orange)", opacity: 0.7 }} />Умеренная</li>
            <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: "var(--blue)", opacity: 0.7 }} />Ограниченная</li>
          </ul>
          <p className="mt-2 text-center text-xs text-muted">Подсветка означает научно описанную связь с пищевым фактором, а не то, что продукт «повреждает» орган.</p>
        </div>

        {/* Доступ без мыши: тот же выбор списком */}
        <nav aria-label="Органы и системы" className="mt-4">
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {organs.map((o) => {
              const lv = level(o.id);
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(o.id)}
                    aria-pressed={selected === o.id}
                    className={`flex min-h-11 w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-colors ${selected === o.id ? "border-sci bg-sci-soft text-sci" : "border-line bg-surface hover:bg-surface-2"}`}
                    data-testid={`organ-btn-${o.id}`}
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: lv >= 3 ? "var(--red)" : lv === 2 ? "var(--orange)" : lv === 1 ? "var(--blue)" : "var(--border)" }} aria-hidden />
                    {o.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div aria-live="polite" data-testid="organ-panel">
        {!sel ? (
          <div className="card grid h-full place-items-center p-8 text-center">
            <div>
              <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-sci-soft text-sci"><Icon name="body" size={28} /></span>
              <p className="text-lg font-bold">Выберите орган на модели</p>
              <p className="mt-2 text-muted">Цвет подсветки показывает, насколько уверенно описана связь. Органы можно выбрать мышкой, касанием, клавиатурой (Tab и Enter) или списком под моделью.</p>
            </div>
          </div>
        ) : (
          <article className="card animate-pop p-5 sm:p-6" key={sel.id}>
            <p className="eyebrow">{sel.system}</p>
            <h3 className="mt-1 text-2xl font-extrabold">{sel.name}</h3>
            <p className="mt-2 text-muted">{sel.description}</p>

            {selEffects.length === 0 ? (
              <div className="mt-5 rounded-xl bg-surface-2 p-4 text-sm">
                В наших проверенных источниках нет значимых связей между {picked === "all" ? "продуктами каталога" : "этим продуктом"} и этим органом. Мы не показываем связи, которые не можем подтвердить.
              </div>
            ) : (
              <ul className="mt-5 grid gap-4">
                {selEffects.map(({ product, effect }) => (
                  <li key={product.slug + effect.title} className="rounded-2xl border border-line p-4" data-testid="organ-effect">
                    <div className="flex flex-wrap items-center gap-2">
                      {picked === "all" && <span className="chip">{product.name}</span>}
                      <span className="chip">{effect.timeframe === "short" ? "Краткосрочный эффект" : "Долгосрочный риск"}</span>
                    </div>
                    <h4 className="mt-2 text-lg font-bold">{effect.title}</h4>
                    <p className="mt-1.5">{effect.text}</p>
                    <div className="mt-3"><EvidenceBadge type={effect.evidence} confidence={effect.confidence} /></div>
                    <p className="mt-1 text-xs text-muted">{evidenceLabels[effect.evidence].hint}.</p>
                    <SourceRefs ids={effect.sourceIds} />
                  </li>
                ))}
              </ul>
            )}

            {(relatedDiseases.length > 0 || otherDiseases.length > 0) && (
              <div className="mt-5">
                <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted">Связанные заболевания</h4>
                <div className="flex flex-wrap gap-2">
                  {relatedDiseases.map((d) => d && (
                    <Link key={d.slug} href={`/diseases/${d.slug}`} className="btn btn-sci text-sm">{d.name}<Icon name="arrow-right" size={16} /></Link>
                  ))}
                  {otherDiseases.map((d) => (
                    <Link key={d.slug} href={`/diseases/${d.slug}`} className="btn btn-secondary text-sm">{d.name}</Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href={prevHref} className="btn btn-primary" data-testid="to-prevention">
                <Icon name="shield" size={18} />Узнать о профилактике
              </Link>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
