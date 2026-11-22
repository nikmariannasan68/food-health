"use client";
import Link from "next/link";
import { useState } from "react";
import { getDisease, getProduct, quizzes, products, diseases } from "@/content";
import { achievements, resetAll, updateState, useAppState } from "@/lib/storage";
import { Icon } from "@/components/ui/Icon";

function resolve(key: string) {
  const [kind, slug] = key.split(":");
  if (kind === "product") { const p = getProduct(slug); return p && { title: p.name, href: `/products/${slug}`, kind: "Продукт" }; }
  if (kind === "disease") { const d = getDisease(slug); return d && { title: d.name, href: `/diseases/${slug}`, kind: "Заболевание" }; }
  return undefined;
}

export function FavoritesView() {
  const state = useAppState();
  const favs = state.favorites.map((k) => ({ k, r: resolve(k) })).filter((x) => x.r);
  const history = state.viewed.map((k) => ({ k, r: resolve(k) })).filter((x) => x.r).reverse();
  const viewedProducts = state.viewed.filter((k) => k.startsWith("product:")).length;
  const viewedDiseases = state.viewed.filter((k) => k.startsWith("disease:")).length;
  const passed = Object.keys(state.quizzes).length;
  const ach = achievements(state);
  const [confirming, setConfirming] = useState(false);

  const stats = [
    { label: "Изучено продуктов", v: viewedProducts, of: products.length, icon: "search" },
    { label: "Прочитано о заболеваниях", v: viewedDiseases, of: diseases.length, icon: "book" },
    { label: "Пройдено тестов", v: passed, of: quizzes.length, icon: "quiz" },
  ];

  return (
    <div className="grid gap-10" data-testid="favorites-view">
      <section aria-labelledby="progress-title">
        <h2 id="progress-title" className="mb-4 text-2xl font-extrabold">Образовательный прогресс</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="card p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-sci-soft text-sci"><Icon name={s.icon} /></span>
                <p className="font-display text-3xl font-extrabold tabular-nums">{s.v}<span className="text-lg text-muted">/{s.of}</span></p>
              </div>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
              <div className="meter mt-3" aria-hidden><span style={{ width: `${(s.v / s.of) * 100}%`, background: "var(--blue)" }} /></div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="ach-title">
        <h2 id="ach-title" className="mb-4 text-2xl font-extrabold">Значки</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ach.map((a) => (
            <li key={a.id} className={`card flex items-center gap-3 p-4 ${a.earned ? "" : "opacity-60"}`} data-testid={`badge-${a.id}`} data-earned={a.earned}>
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${a.earned ? "bg-good text-white dark:text-[#06210f]" : "bg-surface-2 text-muted"}`}><Icon name={a.icon} /></span>
              <span>
                <span className="block font-bold">{a.title}</span>
                <span className="block text-xs text-muted">{a.earned ? "Получен · " : ""}{a.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="fav-title">
        <h2 id="fav-title" className="mb-4 text-2xl font-extrabold">Избранное</h2>
        {favs.length === 0 ? (
          <div className="card p-8 text-center text-muted">Пока пусто. Нажмите «В избранное» на странице продукта или заболевания.</div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {favs.map(({ k, r }) => (
              <li key={k} className="card flex items-center gap-3 p-4" data-testid="fav-item">
                <Icon name="heart" filled className="text-risk" />
                <Link href={r!.href} className="flex-1 font-semibold hover:underline">{r!.title}<span className="block text-xs font-normal text-muted">{r!.kind}</span></Link>
                <button type="button" className="btn btn-ghost btn-icon" aria-label={`Удалить из избранного: ${r!.title}`} onClick={() => updateState((s) => ({ ...s, favorites: s.favorites.filter((x) => x !== k) }))}>
                  <Icon name="x" size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="hist-title">
        <h2 id="hist-title" className="mb-4 text-2xl font-extrabold">История изучения</h2>
        {history.length === 0 ? (
          <div className="card p-8 text-center text-muted">Здесь появятся материалы, которые вы уже открывали.</div>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {history.map(({ k, r }) => <li key={k}><Link href={r!.href} className="chip hover:text-ink"><Icon name="check" size={13} />{r!.title}</Link></li>)}
          </ul>
        )}
      </section>

      <div className="card flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center">
        <p className="flex-1 text-sm text-muted">Все данные хранятся только в этом браузере. Их можно удалить в любой момент.</p>
        {confirming ? (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Подтверждение удаления">
            <span className="text-sm font-semibold">Удалить весь прогресс, избранное и план?</span>
            <button type="button" className="btn btn-primary" onClick={() => { resetAll(); setConfirming(false); }}>Да, удалить</button>
            <button type="button" className="btn btn-ghost" onClick={() => setConfirming(false)}>Отмена</button>
          </div>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={() => setConfirming(true)}>
            <Icon name="trash" size={18} />Очистить данные
          </button>
        )}
      </div>
    </div>
  );
}
