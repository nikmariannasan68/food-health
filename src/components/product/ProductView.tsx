import Link from "next/link";
import {
  categoryLabels, diseasesForProduct, evidenceLabels, getQuiz, getTip, relatedProducts, type Product,
} from "@/content";
import { BodyMap } from "@/components/body/BodyMap";
import { FavoriteButton, ShareButton, TrackView } from "@/components/ui/Actions";
import { EvidenceBadge, ReviewNotice } from "@/components/ui/Badges";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { Icon } from "@/components/ui/Icon";
import { ScrollButton } from "@/components/ui/ScrollButton";
import { SourceList } from "@/components/ui/SourceList";
import { KnowledgeMap } from "./KnowledgeMap";
import { NutrientPanel } from "./NutrientPanel";
import { ProductArt } from "./ProductArt";
import { ProductCard } from "./ProductCard";

const STAGES = [
  { id: "composition", label: "Состав" },
  { id: "body", label: "Организм" },
  { id: "diseases", label: "Заболевания" },
  { id: "prevention", label: "Профилактика" },
  { id: "quiz", label: "Тест" },
];

function SectionTitle({ n, title, lead }: { n: number; title: string; lead?: string }) {
  return (
    <div className="mb-6">
      <p className="eyebrow">Этап {n} из 6</p>
      <h2 className="mt-1 text-3xl font-extrabold sm:text-4xl">{title}</h2>
      {lead && <p className="lead mt-2 max-w-3xl">{lead}</p>}
    </div>
  );
}

export function ProductView({ product }: { product: Product }) {
  const diseases = diseasesForProduct(product);
  const quiz = getQuiz(product.quizSlug);
  const related = relatedProducts(product);
  const tips = product.tipIds.map(getTip).filter(Boolean);

  return (
    <article data-testid="product-view">
      <TrackView itemKey={`product:${product.slug}`} />

      {/* 4.1 Первый экран */}
      <section className="gradient-hero relative overflow-hidden border-b border-line">
        <div className="container-page grid grid-cols-1 items-center gap-8 py-10 md:grid-cols-[1.1fr_1fr] md:py-16">
          <div className="animate-fade-up min-w-0">
            <nav aria-label="Хлебные крошки" className="mb-4 text-sm text-muted">
              <Link href="/products" className="hover:text-ink">Продукты</Link> <span aria-hidden>/</span> <span aria-current="page">{product.name}</span>
            </nav>
            <div className="mb-3 flex flex-wrap gap-2">
              {product.categories.map((c) => <span key={c} className="chip">{categoryLabels[c]}</span>)}
              <span className="chip chip-green"><Icon name="check" size={13} />Этап 1: продукт выбран</span>
            </div>
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl">{product.name}</h1>
            <p className="lead mt-4 max-w-xl">{product.description}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Типичные особенности состава">
              {product.typicalFeatures.map((f) => <li key={f} className="chip">{f}</li>)}
            </ul>
            <div className="mt-6 flex gap-3 rounded-2xl border border-[color-mix(in_oklab,var(--orange)_35%,transparent)] bg-warn-soft p-4" role="note">
              <Icon name="alert" className="mt-0.5 shrink-0 text-warn" />
              <p className="text-sm sm:text-base">{product.notice}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <ScrollButton target="body" testId="cta-body"><Icon name="body" size={18} />Посмотреть влияние на организм</ScrollButton>
              <ScrollButton target="composition" className="btn btn-secondary">Изучить состав</ScrollButton>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <FavoriteButton itemKey={`product:${product.slug}`} label={product.name} />
              <ShareButton />
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-6 rounded-full bg-surface shadow-pop" aria-hidden />
            <ProductArt art={product.art} className="animate-float relative h-full w-full p-10" title={product.imageAlt} />
          </div>
        </div>
      </section>

      {/* Навигация по этапам */}
      <nav aria-label="Этапы изучения" className="sticky top-16 z-30 border-b border-line bg-[color-mix(in_oklab,var(--bg)_88%,transparent)] backdrop-blur-xl">
        <ol className="container-page flex gap-1 overflow-x-auto py-2 text-sm">
          {STAGES.map((s, i) => (
            <li key={s.id} className="shrink-0">
              <ScrollButton target={s.id} className="flex min-h-10 items-center gap-2 rounded-full px-3 font-semibold text-muted hover:bg-surface-2 hover:text-ink">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-surface-2 text-xs text-ink">{i + 2}</span>{s.label}
              </ScrollButton>
            </li>
          ))}
        </ol>
      </nav>

      <div className="container-page grid gap-20 py-14">
        {/* 4.2 Состав */}
        <section id="composition" className="scroll-mt-32 outline-none">
          <SectionTitle n={2} title="Состав" lead={`Ключевые компоненты на ${product.unit === "ml" ? "100 мл" : "100 г"} и на типичную порцию. Нажмите на показатель, чтобы узнать, что он означает и откуда данные.`} />
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <NutrientPanel product={product} />
            <div className="grid content-start gap-4">
              {product.keyFactors.map((k) => (
                <div key={k.nutrient} className="card p-5">
                  <p className="eyebrow !text-warn">На что обратить внимание</p>
                  <p className="mt-2">{k.text}</p>
                </div>
              ))}
              <ScrollButton target="body" className="btn btn-primary w-full" testId="cta-body-2"><Icon name="body" size={18} />Как это влияет на организм?</ScrollButton>
            </div>
          </div>
        </section>

        {/* 5 Модель организма */}
        <section id="body" className="scroll-mt-32 outline-none">
          <SectionTitle n={3} title="Воздействие на организм" lead="Подсвечены органы и системы, для которых в научных источниках описаны связи с пищевыми факторами этого продукта. Тип связи указан у каждого объяснения." />
          <BodyMap productSlug={product.slug} preventionHref={`/prevention?product=${product.slug}`} />
        </section>

        {/* 6 Заболевания */}
        <section id="diseases" className="scroll-mt-32 outline-none">
          <SectionTitle n={4} title="Возможные заболевания" lead="Риск этих состояний может повышаться при определённых пищевых привычках. Ни одна порция сама по себе не вызывает заболевание." />
          <div className="grid gap-4 md:grid-cols-2">
            {diseases.map((d) => {
              const effect = product.effects.find((e) => e.diseaseSlugs.includes(d.slug))!;
              return (
                <Link key={d.slug} href={`/diseases/${d.slug}`} className="card card-hover group block p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold">{d.name}</h3>
                    <Icon name="arrow-right" className="mt-1 shrink-0 text-muted transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="mt-1.5 text-muted">{d.short}</p>
                  <div className="mt-3"><EvidenceBadge type={effect.evidence} confidence={effect.confidence} /></div>
                  <p className="mt-2 text-xs text-muted">{evidenceLabels[effect.evidence].hint}</p>
                </Link>
              );
            })}
          </div>
          <div className="mt-8">
            <h3 className="mb-4 text-xl font-bold">Карта знаний</h3>
            <KnowledgeMap product={product} />
          </div>
        </section>

        {/* 7 Профилактика */}
        <section id="prevention" className="scroll-mt-32 outline-none">
          <SectionTitle n={5} title="Профилактика" lead="Реалистичные шаги, которые помогают снизить риски без запретов." />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h3 className="text-lg font-bold">Практические шаги</h3>
              <ul className="prose-fh mt-3">{product.prevention.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
            <div className="grid content-start gap-3">
              {product.alternatives.slice(0, 2).map((a) => (
                <div key={a.to} className="card flex items-center gap-3 p-4">
                  <span className="text-sm text-muted line-through decoration-1">{a.from}</span>
                  <Icon name="arrow-right" className="shrink-0 text-good" />
                  <span className="font-semibold text-good">{a.to}</span>
                </div>
              ))}
              <Link href={`/prevention?product=${product.slug}`} className="btn btn-primary" data-testid="cta-prevention">
                <Icon name="shield" size={18} />Что можно сделать, чтобы снизить риски?
              </Link>
            </div>
          </div>
        </section>

        {/* 8 Тест */}
        <section id="quiz" className="scroll-mt-32 outline-none">
          <SectionTitle n={6} title="Закрепление знаний" />
          {quiz && (
            <div className="card flex flex-col items-start gap-4 bg-gradient-to-br from-sci-soft to-good-soft p-6 sm:flex-row sm:items-center sm:p-8">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-surface text-sci shadow-soft"><Icon name="quiz" size={28} /></span>
              <div className="flex-1">
                <h3 className="text-2xl font-extrabold">{quiz.title}</h3>
                <p className="mt-1 text-muted">{quiz.questions.length} вопросов · с объяснениями после каждого ответа</p>
              </div>
              <Link href={`/quizzes/${quiz.slug}?from=${product.slug}`} className="btn btn-primary" data-testid="cta-quiz">Пройти мини-тест<Icon name="arrow-right" size={18} /></Link>
            </div>
          )}
        </section>

        {/* 10 Связанные материалы */}
        <section aria-labelledby="related-title">
          <h2 id="related-title" className="mb-6 text-2xl font-extrabold">Вам также может быть интересно</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
            {tips.slice(0, Math.max(0, 3 - related.length)).map((t) => t && (
              <Link key={t.id} href={`/prevention#tip-${t.id}`} className="card card-hover p-5">
                <p className="eyebrow">Профилактика</p>
                <h3 className="mt-1 text-lg font-bold">{t.title}</h3>
                <p className="mt-1 text-sm text-muted">{t.text}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid gap-6">
          <ReviewNotice reviewedAt={product.reviewedAt} medicalReview={product.medicalReview} />
          <SourceList ids={product.sourceIds} id="sources" />
          <Disclaimer />
        </div>
      </div>
    </article>
  );
}
