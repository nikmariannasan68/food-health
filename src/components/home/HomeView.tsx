import Link from "next/link";
import { Suspense } from "react";
import { diseases, products, quizzes } from "@/content";
import { plural } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";
import { ScrollButton } from "@/components/ui/ScrollButton";
import { ProductArt } from "@/components/product/ProductArt";
import { ProductCatalog } from "@/components/product/ProductCatalog";

const FLOAT = [
  { art: "burger", cls: "left-[2%] top-[34%] w-[34%]", delay: "0s", r: "-8deg" },
  { art: "soda", cls: "left-[36%] top-[2%] w-[34%]", delay: ".8s", r: "6deg" },
  { art: "chips", cls: "right-[0%] top-[28%] w-[34%]", delay: "1.6s", r: "8deg" },
  { art: "coffee", cls: "left-[16%] bottom-[0%] w-[32%]", delay: "2.2s", r: "-4deg" },
  { art: "chocolate", cls: "right-[10%] bottom-[2%] w-[28%]", delay: "1.2s", r: "12deg" },
];

const STEPS = [
  { icon: "search", title: "Выбор продукта", text: "Выберите продукт из каталога." },
  { icon: "label", title: "Состав", text: "Сахар, соль, жиры, кофеин — на 100 г и на порцию." },
  { icon: "body", title: "Организм", text: "Интерактивная модель: какие органы и системы связаны с продуктом." },
  { icon: "heart", title: "Заболевания", text: "Риски с указанием уровня доказательности." },
  { icon: "shield", title: "Профилактика", text: "Альтернативы, «Было / Стало» и план привычек." },
  { icon: "quiz", title: "Закрепление", text: "Мини-тест с объяснениями и значки." },
];

export function HomeView() {
  return (
    <>
      <section className="gradient-hero relative overflow-hidden">
        <div className="container-page grid items-center gap-10 py-14 md:grid-cols-[1.05fr_1fr] md:py-24">
          <div className="animate-fade-up">
            <p className="chip chip-green mb-5"><Icon name="sparkles" size={14} />Твой выбор сегодня — твоё здоровье завтра</p>
            <h1 className="text-[2.4rem] font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
              Знаешь ли ты, как твоя еда <span className="bg-gradient-to-r from-good to-sci bg-clip-text text-transparent">влияет на здоровье?</span>
            </h1>
            <p className="lead mt-6 max-w-xl">Исследуй продукты, узнавай об их влиянии на организм и открывай научно обоснованные способы профилактики заболеваний.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ScrollButton target="catalog" testId="hero-explore">Исследовать продукты<Icon name="arrow-right" size={18} /></ScrollButton>
              <ScrollButton target="how" className="btn btn-secondary">Как это работает?</ScrollButton>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[[products.length, plural(products.length, "продукт", "продукта", "продуктов") + " с полным разбором"], [diseases.length, "материалов о заболеваниях"], [quizzes.length, "интерактивных тестов"]].map(([n, l]) => (
                <div key={String(l)}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-3xl font-extrabold">{n}</dd>
                  <dd className="text-xs text-muted">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[520px]" aria-hidden>
            <div className="absolute inset-[12%] rounded-full bg-surface shadow-pop" />
            <div className="absolute inset-[22%] rounded-full border-2 border-dashed border-line" />
            {FLOAT.map((f) => (
              <div key={f.art} className={`absolute ${f.cls} animate-float`} style={{ animationDelay: f.delay, ["--r" as string]: f.r }}>
                <ProductArt art={f.art} className="h-auto w-full drop-shadow-xl" animated={false} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="container-page scroll-mt-20 py-16 outline-none" aria-labelledby="catalog-title">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Каталог</p>
            <h2 id="catalog-title" className="mt-1 text-3xl font-extrabold sm:text-4xl">Выберите продукт</h2>
            <p className="lead mt-2 max-w-2xl">Ни один продукт не бывает абсолютно «вредным» или «полезным»: важны состав, количество, частота и рацион в целом.</p>
          </div>
          <Link href="/products" className="btn btn-secondary self-start sm:self-auto">Весь каталог<Icon name="arrow-right" size={18} /></Link>
        </div>
        <Suspense fallback={null}><ProductCatalog compact /></Suspense>
      </section>

      <section id="how" className="scroll-mt-20 border-y border-line bg-surface py-16 outline-none" aria-labelledby="how-title">
        <div className="container-page">
          <p className="eyebrow">Как это работает</p>
          <h2 id="how-title" className="mt-1 text-3xl font-extrabold sm:text-4xl">Шесть шагов от продукта к привычке</h2>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="card relative p-6">
                <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-surface-2" aria-hidden>{i + 1}</span>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-good-soft text-good"><Icon name={s.icon} size={24} /></span>
                <h3 className="mt-4 text-lg font-bold"><span className="sr-only">Шаг {i + 1}. </span>{s.title}</h3>
                <p className="mt-1 text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page grid gap-5 py-16 md:grid-cols-3">
        {[
          { href: "/body", icon: "body", t: "Организм человека", d: "Изучите 10 органов и систем на интерактивной модели.", c: "bg-sci-soft text-sci" },
          { href: "/myths", icon: "bulb", t: "Миф или факт?", d: "«Любое количество кофе опасно» — правда ли это?", c: "bg-warn-soft text-warn" },
          { href: "/prevention/habits", icon: "leaf", t: "План на 7 дней", d: "Одна реалистичная цель и спокойное отслеживание прогресса.", c: "bg-good-soft text-good" },
        ].map((x) => (
          <Link key={x.href} href={x.href} className="card card-hover group flex flex-col gap-3 p-6">
            <span className={`grid h-12 w-12 place-items-center rounded-2xl ${x.c}`}><Icon name={x.icon} size={24} /></span>
            <h2 className="text-xl font-extrabold">{x.t}</h2>
            <p className="flex-1 text-muted">{x.d}</p>
            <span className="inline-flex items-center gap-1 font-semibold text-good">Открыть<Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" /></span>
          </Link>
        ))}
      </section>
    </>
  );
}
