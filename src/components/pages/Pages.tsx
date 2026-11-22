/**
 * Тела страниц. Маршруты в app/ — тонкие обёртки (метаданные + Suspense),
 * поэтому те же компоненты используются в превью-сборке (preview/) для автотестов.
 */
import Link from "next/link";
import { Suspense } from "react";
import { diseases, getOrgan, productsForDisease, sources } from "@/content";
import { BodyPageView } from "@/components/body/BodyPageView";
import { CompareView } from "@/components/compare/CompareView";
import { MythCards } from "@/components/myths/MythCards";
import { HabitPlanner } from "@/components/prevention/HabitPlanner";
import { PreventionView } from "@/components/prevention/PreventionView";
import { ProductCatalog } from "@/components/product/ProductCatalog";
import { FavoritesView } from "@/components/progress/FavoritesView";
import { QuizCatalog } from "@/components/quiz/QuizCatalog";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/PageHeader";
import { SourceList } from "@/components/ui/SourceList";

export function Loading() {
  return (
    <div className="container-page py-20" role="status" aria-live="polite">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-line border-t-[var(--green)]" />
      <p className="mt-4 text-center text-muted">Загрузка…</p>
    </div>
  );
}

export function ProductsPage() {
  return (
    <>
      <PageHeader eyebrow="Каталог" title="Продукты" lead="Выберите продукт, чтобы изучить его состав, влияние на организм, связанные риски и способы профилактики." />
      <div className="container-page py-12">
        <Suspense fallback={<Loading />}><ProductCatalog /></Suspense>
        <p className="mt-8 text-sm text-muted">Каталог пополняется: каждый новый продукт добавляется только после сверки данных с источниками.</p>
      </div>
    </>
  );
}

export function BodyPage() {
  return (
    <>
      <PageHeader eyebrow="Интерактивная анатомия" title="Организм человека" lead="Выберите продукт и орган, чтобы увидеть, какие связи описаны в научных источниках. Модель работает с мышью, касанием и клавиатурой." />
      <div className="container-page py-12">
        <Suspense fallback={<Loading />}><BodyPageView /></Suspense>
        <Disclaimer className="mt-10" />
      </div>
    </>
  );
}

export function DiseasesPage() {
  return (
    <>
      <PageHeader eyebrow="Каталог" title="Заболевания и состояния" lead="Как развиваются состояния, на риск которых может влиять питание, и что помогает профилактике." />
      <div className="container-page py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {diseases.map((d, i) => (
            <Link key={d.slug} href={`/diseases/${d.slug}`} className="card card-hover animate-fade-up flex flex-col gap-3 p-6" style={{ animationDelay: `${i * 60}ms` }} data-testid="disease-card">
              <h2 className="text-xl font-extrabold">{d.name}</h2>
              <p className="flex-1 text-muted">{d.short}</p>
              <div className="flex flex-wrap gap-1.5">{d.organs.slice(0, 3).map((o) => <span key={o} className="chip">{getOrgan(o).name}</span>)}</div>
              {productsForDisease(d.slug).length > 0 && (
                <p className="text-xs text-muted">Связанные продукты: {productsForDisease(d.slug).map((p) => p.name).join(", ")}</p>
              )}
            </Link>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">Железодефицитные состояния, дислипидемия и заболевания ЖКТ будут добавлены после подготовки материалов по источникам.</p>
        <Disclaimer className="mt-6" />
      </div>
    </>
  );
}

export function PreventionPage() {
  return <Suspense fallback={<Loading />}><PreventionView /></Suspense>;
}

export function HabitsPage() {
  return (
    <>
      <PageHeader eyebrow="Профилактика" title="План формирования привычек на 7 дней" lead="Одна небольшая цель, семь дней, никаких наказаний. Пропущенный день — это нормально.">
        <Link href="/prevention" className="btn btn-secondary mt-6"><Icon name="arrow-left" size={18} />К профилактике</Link>
      </PageHeader>
      <div className="container-page py-12"><HabitPlanner /></div>
    </>
  );
}

export function QuizzesPage() {
  return (
    <>
      <PageHeader eyebrow="Тесты" title="Проверь свои знания" lead="Короткие тесты с объяснениями. Результаты отражают знания и не являются оценкой здоровья." />
      <div className="container-page py-12"><QuizCatalog /></div>
    </>
  );
}

export function MythsPage() {
  return (
    <>
      <PageHeader eyebrow="Миф или факт" title="Распространённые утверждения о еде" lead="Выберите ответ — и откроется объяснение с источниками. Некоторые утверждения нельзя назвать ни мифом, ни фактом: всё зависит от обстоятельств." />
      <div className="container-page py-12"><MythCards /></div>
    </>
  );
}

export function ComparePage() {
  return (
    <>
      <PageHeader eyebrow="Инструменты" title="Сравнение продуктов" lead="Выберите два продукта и сравните их состав." />
      <div className="container-page py-12"><CompareView /></div>
    </>
  );
}

export function FavoritesPage() {
  return (
    <>
      <PageHeader eyebrow="Личное" title="Избранное и прогресс" lead="Сохранённые материалы, история изучения и значки. Всё хранится только в вашем браузере." />
      <div className="container-page py-12"><FavoritesView /></div>
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="О проекте" title="Food & Health — узнай, что ты ешь" lead="Образовательная платформа для подростков, студентов, родителей и всех, кто хочет разобраться, как питание связано со здоровьем." />
      <div className="container-page grid gap-6 py-12 md:grid-cols-3">
        {[
          { i: "shield", t: "Без запугивания", d: "Мы не делим еду на «плохую» и «хорошую». Риск зависит от количества, частоты и рациона в целом." },
          { i: "flask", t: "Доказательная медицина", d: "Опираемся на ВОЗ, EFSA, CDC, FDA и систематические обзоры. Для каждой связи указываем тип доказательств и уровень уверенности." },
          { i: "leaf", t: "Маленькие шаги", d: "Вместо запретов — реалистичные альтернативы и план на 7 дней." },
        ].map((x) => (
          <div key={x.t} className="card p-6">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-good-soft text-good"><Icon name={x.i} size={24} /></span>
            <h2 className="mt-4 text-xl font-bold">{x.t}</h2>
            <p className="mt-2 text-muted">{x.d}</p>
          </div>
        ))}
        <div className="card p-6 md:col-span-3">
          <h2 className="text-xl font-bold">Текущий статус</h2>
          <ul className="prose-fh mt-3">
            <li>Шесть продуктов (сладкая газировка, чипсы, кофе, энергетики, шоколад, лапша быстрого приготовления) с полным сценарием от состава до теста.</li>
            <li>Материалы подготовлены по указанным источникам и ожидают рецензии медицинского редактора — это отмечено на каждой странице.</li>
            <li>Иллюстрации продуктов нарисованы специально для проекта, их можно заменить лицензированными фотографиями.</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/sources" className="btn btn-sci">Источники и редакционная политика</Link>
            <Link href="/privacy" className="btn btn-secondary">Конфиденциальность</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export function SourcesPage() {
  return (
    <>
      <PageHeader eyebrow="Научная достоверность" title="Источники и редакционная политика" />
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.4fr]">
        <div className="grid content-start gap-5">
          <div className="card p-6">
            <h2 className="text-xl font-bold">Как мы работаем</h2>
            <ul className="prose-fh mt-3">
              <li>Используем рекомендации ВОЗ, EFSA, CDC, FDA, NIH, национальные клинические рекомендации, систематические обзоры и метаанализы.</li>
              <li>Не придумываем исследования, DOI, статистику и значения состава. Если проверенных данных нет, пишем «Данные уточняются».</li>
              <li>Разделяем прямые эффекты, доказанные причинные связи, статистические ассоциации и влияние рациона в целом.</li>
              <li>Указываем дату публикации или обновления источника и дату, когда редакция его сверила.</li>
              <li>Каждый материал проходит рецензию медицинского редактора. До неё мы явно помечаем материал.</li>
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-bold">Обозначения</h2>
            <dl className="mt-3 grid gap-3 text-sm">
              <div><dt className="font-semibold text-sci">Прямой эффект</dt><dd className="text-muted">Физиологическое действие вскоре после употребления (например, кофеин и бодрость).</dd></div>
              <div><dt className="font-semibold text-sci">Доказанная причинная связь</dt><dd className="text-muted">Признана ведущими организациями (например, свободные сахара и кариес).</dd></div>
              <div><dt className="font-semibold text-warn">Статистическая связь</dt><dd className="text-muted">Обнаружена в наблюдательных исследованиях; причинность не доказана.</dd></div>
              <div><dt className="font-semibold text-good">Влияние рациона в целом</dt><dd className="text-muted">Эффект зависит от общего питания, а не от одного продукта.</dd></div>
              <div><dt className="font-semibold">Ориентировочно</dt><dd className="text-muted">Типичный диапазон для категории; у конкретной марки смотрите этикетку.</dd></div>
            </dl>
          </div>
          <Disclaimer />
        </div>
        <SourceList ids={sources.map((s) => s.id)} title={`Все источники (${sources.length})`} />
      </div>
    </>
  );
}

export function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Конфиденциальность" title="Политика конфиденциальности" />
      <div className="container-page max-w-3xl py-12">
        <div className="card prose-fh grid gap-4 p-6 sm:p-8">
          <p>Сайт работает без регистрации и не собирает медицинские персональные данные.</p>
          <h2 className="text-xl font-bold">Что хранится и где</h2>
          <ul>
            <li>Избранное, история просмотров, результаты тестов, ответы в «Миф или факт» и план привычек сохраняются только в локальном хранилище вашего браузера (localStorage).</li>
            <li>Настройки темы и анимаций — там же.</li>
            <li>Эти данные не передаются на сервер и не используются для рекламы.</li>
          </ul>
          <h2 className="text-xl font-bold">Как удалить данные</h2>
          <p>Откройте «<Link href="/favorites" className="text-good underline">Избранное и прогресс</Link>» и нажмите «Очистить данные» или очистите данные сайта в настройках браузера.</p>
          <h2 className="text-xl font-bold">Внешние ссылки</h2>
          <p>Ссылки на источники ведут на сайты ВОЗ, EFSA, CDC, FDA и научных журналов. У этих сайтов свои правила конфиденциальности.</p>
        </div>
      </div>
    </>
  );
}

export function NotFoundView() {
  return (
    <div className="container-page grid place-items-center py-24 text-center" data-testid="not-found">
      <div>
        <p className="font-display text-7xl font-extrabold text-good">404</p>
        <h1 className="mt-3 text-3xl font-extrabold">Такой страницы нет</h1>
        <p className="mt-2 text-muted">Возможно, ссылка устарела или материал ещё готовится.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">На главную</Link>
          <Link href="/products" className="btn btn-secondary">Каталог продуктов</Link>
        </div>
      </div>
    </div>
  );
}
