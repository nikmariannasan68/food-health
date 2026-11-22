"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getProduct, getQuiz, products, tips } from "@/content";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { Icon } from "@/components/ui/Icon";
import { SourceRefs } from "@/components/ui/SourceList";
import { ProductArt } from "@/components/product/ProductArt";
import { BeforeAfter } from "./BeforeAfter";

const toneCls = { green: "bg-good-soft text-good", blue: "bg-sci-soft text-sci", orange: "bg-warn-soft text-warn" } as const;

export function PreventionView() {
  const params = useSearchParams();
  const slug = params?.get("product") ?? "";
  const product = slug ? getProduct(slug) : undefined;
  const list = product ? [product] : products;
  const quiz = product ? getQuiz(product.quizSlug) : undefined;
  const ordered = product ? [...product.tipIds.map((id) => tips.find((t) => t.id === id)!), ...tips.filter((t) => !product.tipIds.includes(t.id))] : tips;

  return (
    <div data-testid="prevention-view">
      <section className="gradient-hero border-b border-line">
        <div className="container-page py-12 md:py-16">
          <p className="eyebrow">Профилактика{product ? ` · ${product.name}` : ""}</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-extrabold sm:text-5xl">Что можно сделать, чтобы снизить риски?</h1>
          <p className="lead mt-4 max-w-2xl">Маленькие реалистичные изменения, которые можно держать долго, работают лучше строгих запретов. Выберите продукт, чтобы увидеть рекомендации для него.</p>
          <div role="group" aria-label="Выбор продукта" className="mt-6 flex flex-wrap gap-2">
            <Link href="/prevention" className="filter-btn inline-flex items-center" aria-pressed={!product}>Все</Link>
            {products.map((p) => (
              <Link key={p.slug} href={`/prevention?product=${p.slug}`} className="filter-btn inline-flex items-center" aria-pressed={product?.slug === p.slug}>{p.name}</Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container-page grid gap-16 py-12">
        {/* 7.1 Альтернативы */}
        <section aria-labelledby="alt-title">
          <h2 id="alt-title" className="mb-2 text-3xl font-extrabold">Полезные альтернативы</h2>
          <p className="mb-6 text-muted">Учитывайте свои противопоказания и пищевые аллергии. При заболеваниях согласуйте изменения рациона с врачом.</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.flatMap((p) => p.alternatives.map((a) => ({ p, a }))).map(({ p, a }) => (
              <div key={p.slug + a.to} className="card p-5" data-testid="alternative">
                <div className="flex items-center gap-3">
                  <ProductArt art={p.art} className="h-12 w-12 shrink-0" animated={false} />
                  <div className="min-w-0">
                    <p className="text-sm text-muted">{a.from}</p>
                    <p className="flex items-center gap-1.5 font-bold text-good"><Icon name="arrow-right" size={16} className="shrink-0" />{a.to}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm">{a.why}</p>
                {a.caution && <p className="mt-2 flex gap-2 rounded-xl bg-warn-soft p-2.5 text-xs text-warn"><Icon name="alert" size={15} className="shrink-0" />{a.caution}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* 7.2 Было / Стало */}
        <section aria-labelledby="ba-title">
          <h2 id="ba-title" className="mb-2 text-3xl font-extrabold">Было / Стало</h2>
          <p className="mb-6 text-muted">Сравниваем одинаковые порции. Если по альтернативе нет проверенных данных, мы пишем «Данные уточняются».</p>
          <div className="grid gap-5 lg:grid-cols-2">
            {list.flatMap((p) => p.beforeAfter).map((b) => <BeforeAfter key={b.before + b.after} data={b} />)}
          </div>
        </section>

        {/* Специфичные шаги продукта */}
        {product && (
          <section aria-labelledby="steps-title" className="card p-6 sm:p-8">
            <h2 id="steps-title" className="text-2xl font-extrabold">Шаги для привычки «{product.name}»</h2>
            <ul className="prose-fh mt-4 grid gap-2 md:grid-cols-2">{product.prevention.map((s) => <li key={s}>{s}</li>)}</ul>
          </section>
        )}

        {/* 7.3 Рекомендации */}
        <section aria-labelledby="tips-title">
          <h2 id="tips-title" className="mb-6 text-3xl font-extrabold">Практические рекомендации</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ordered.map((t) => (
              <article key={t.id} id={`tip-${t.id}`} className={`card scroll-mt-24 p-5 ${product?.tipIds.includes(t.id) ? "ring-2 ring-[color-mix(in_oklab,var(--green)_40%,transparent)]" : ""}`} data-testid="tip-card">
                <span className={`grid h-11 w-11 place-items-center rounded-xl ${toneCls[t.tone]}`}><Icon name={t.icon} /></span>
                <h3 className="mt-3 text-lg font-bold">{t.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{t.text}</p>
                <SourceRefs ids={t.sourceIds} />
              </article>
            ))}
          </div>
        </section>

        {/* 7.4 План + тест */}
        <section className="grid gap-5 md:grid-cols-2">
          <Link href="/prevention/habits" className="card card-hover flex flex-col gap-3 bg-gradient-to-br from-good-soft to-surface p-6" data-testid="to-habits">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-surface text-good shadow-soft"><Icon name="leaf" size={24} /></span>
            <h2 className="text-2xl font-extrabold">План привычек на 7 дней</h2>
            <p className="text-muted">Выберите одну реалистичную цель и отмечайте выполнение. Без давления и чувства вины.</p>
            <span className="btn btn-primary mt-auto self-start">Начать план<Icon name="arrow-right" size={18} /></span>
          </Link>
          <Link href={quiz ? `/quizzes/${quiz.slug}?from=${product?.slug}` : "/quizzes"} className="card card-hover flex flex-col gap-3 bg-gradient-to-br from-sci-soft to-surface p-6" data-testid="prevention-to-quiz">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-surface text-sci shadow-soft"><Icon name="quiz" size={24} /></span>
            <h2 className="text-2xl font-extrabold">{quiz ? `Мини-тест: ${quiz.title}` : "Проверьте знания"}</h2>
            <p className="text-muted">Закрепите материал: после каждого ответа — объяснение с источниками.</p>
            <span className="btn btn-sci mt-auto self-start">Пройти тест<Icon name="arrow-right" size={18} /></span>
          </Link>
        </section>

        <Disclaimer />
      </div>
    </div>
  );
}
