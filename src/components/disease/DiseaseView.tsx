import Link from "next/link";
import { getOrgan, productsForDisease, tips, type Disease } from "@/content";
import { FavoriteButton, ShareButton, TrackView } from "@/components/ui/Actions";
import { EvidenceBadge, ReviewNotice } from "@/components/ui/Badges";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { Icon } from "@/components/ui/Icon";
import { SourceList, SourceRefs } from "@/components/ui/SourceList";
import { ProductArt } from "@/components/product/ProductArt";

function Block({ n, title, children, tone }: { n: number; title: string; children: React.ReactNode; tone?: "warn" | "good" }) {
  return (
    <section className="card p-6" aria-labelledby={`sec-${n}`}>
      <div className="mb-3 flex items-center gap-3">
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${tone === "warn" ? "bg-warn-soft text-warn" : tone === "good" ? "bg-good-soft text-good" : "bg-sci-soft text-sci"}`}>{n}</span>
        <h2 id={`sec-${n}`} className="text-xl font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function DiseaseView({ disease }: { disease: Disease }) {
  const prods = productsForDisease(disease.slug);
  const relTips = tips.filter((t) => t.sourceIds.some((s) => disease.sourceIds.includes(s))).slice(0, 3);
  return (
    <article className="container-page py-10" data-testid="disease-view">
      <TrackView itemKey={`disease:${disease.slug}`} />
      <nav aria-label="Хлебные крошки" className="mb-4 text-sm text-muted">
        <Link href="/diseases" className="hover:text-ink">Заболевания</Link> <span aria-hidden>/</span> <span aria-current="page">{disease.name}</span>
      </nav>
      <header className="mb-8 max-w-3xl">
        <h1 className="text-4xl font-extrabold sm:text-5xl">{disease.name}</h1>
        <p className="lead mt-3">{disease.short}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {disease.organs.map((o) => <Link key={o} href={`/body?organ=${o}`} className="chip hover:text-ink">{getOrgan(o).name}</Link>)}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <FavoriteButton itemKey={`disease:${disease.slug}`} label={disease.name} />
          <ShareButton />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid min-w-0 gap-5">
          <Disclaimer />
          <Block n={1} title="Что это за заболевание?"><p>{disease.what}</p></Block>
          <Block n={2} title="Какие факторы повышают риск?">
            <ul className="prose-fh">{disease.riskFactors.map((r) => <li key={r}>{r}</li>)}</ul>
          </Block>
          <Block n={3} title="Какие пищевые привычки могут быть связаны с риском?">
            <ul className="grid gap-4">
              {disease.dietLinks.map((l) => (
                <li key={l.text} className="rounded-xl border border-line p-4">
                  <p>{l.text}</p>
                  <div className="mt-2"><EvidenceBadge type={l.evidence} confidence={l.confidence} /></div>
                  <SourceRefs ids={l.sourceIds} />
                </li>
              ))}
            </ul>
          </Block>
          <Block n={4} title="Как развивается заболевание?"><p>{disease.mechanism}</p></Block>
          <Block n={5} title="Возможные симптомы">
            <ul className="prose-fh">{disease.symptoms.map((s) => <li key={s}>{s}</li>)}</ul>
            <p className="mt-4 rounded-xl bg-surface-2 p-3 text-sm text-muted">Симптомы не позволяют поставить диагноз самостоятельно. Диагноз ставит врач по результатам осмотра и обследований.</p>
          </Block>
          <Block n={6} title="Профилактика" tone="good">
            <ul className="prose-fh">{disease.prevention.map((s) => <li key={s}>{s}</li>)}</ul>
            <Link href="/prevention" className="btn btn-primary mt-4"><Icon name="shield" size={18} />Все рекомендации по профилактике</Link>
          </Block>
          <Block n={7} title="Когда необходимо обратиться к врачу?" tone="warn">
            <ul className="prose-fh">{disease.whenToSeeDoctor.map((s) => <li key={s}>{s}</li>)}</ul>
          </Block>
          <section aria-label="Научные источники" className="pt-2">
            <div className="mb-3 flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-sci-soft text-sm font-bold text-sci">8</span>
              <span className="text-xl font-bold">Научные источники</span>
            </div>
            <SourceList ids={disease.sourceIds} title="Список источников" />
          </section>
          <ReviewNotice reviewedAt={disease.reviewedAt} medicalReview={disease.medicalReview} />
        </div>

        <aside className="grid min-w-0 content-start gap-5 lg:sticky lg:top-24">
          {prods.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-3 font-bold">Связанные продукты</h2>
              <ul className="grid gap-2">
                {prods.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/products/${p.slug}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-surface-2">
                      <ProductArt art={p.art} className="h-12 w-12 shrink-0" animated={false} />
                      <span className="font-semibold">{p.name}</span>
                      <Icon name="chevron-right" size={16} className="ml-auto opacity-50" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {relTips.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-3 font-bold">Профилактика</h2>
              <ul className="grid gap-2">
                {relTips.map((t) => <li key={t.id}><Link href={`/prevention#tip-${t.id}`} className="text-sm font-semibold text-good hover:underline">{t.title}</Link></li>)}
              </ul>
            </div>
          )}
          <Link href="/quizzes" className="card card-hover flex items-center gap-3 p-5">
            <Icon name="quiz" className="text-sci" />
            <span className="font-semibold">Проверить знания в тестах</span>
          </Link>
        </aside>
      </div>
    </article>
  );
}
