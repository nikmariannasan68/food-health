import { StrictMode, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Link from "next/link";
import { getDisease, getProduct, getQuiz } from "@/content";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { DiseaseView } from "@/components/disease/DiseaseView";
import { HomeView } from "@/components/home/HomeView";
import { ProductView } from "@/components/product/ProductView";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import * as P from "@/components/pages/Pages";
import { useLocation } from "./router";

/** Таблица маршрутов — повторяет структуру app/ из Next.js. */
function Route({ path }: { path: string }) {
  const seg = path.split("/").filter(Boolean);
  if (seg.length === 0) return <HomeView />;
  const [a, b, c] = seg;
  if (c) return <P.NotFoundView />;
  switch (a) {
    case "products": {
      if (!b) return <P.ProductsPage />;
      const p = getProduct(b);
      return p ? <ProductView key={p.slug} product={p} /> : <P.NotFoundView />;
    }
    case "diseases": {
      if (!b) return <P.DiseasesPage />;
      const d = getDisease(b);
      return d ? <DiseaseView key={d.slug} disease={d} /> : <P.NotFoundView />;
    }
    case "quizzes": {
      if (!b) return <P.QuizzesPage />;
      const q = getQuiz(b);
      if (!q) return <P.NotFoundView />;
      return (
        <div className="container-page max-w-3xl py-10">
          <Link href="/quizzes" className="text-sm text-muted hover:text-ink">← Все тесты</Link>
          <h1 className="mt-3 mb-6 text-3xl font-extrabold sm:text-4xl">{q.title}</h1>
          <QuizRunner key={q.slug} quiz={q} />
        </div>
      );
    }
    case "prevention":
      if (b === "habits") return <P.HabitsPage />;
      return b ? <P.NotFoundView /> : <P.PreventionPage />;
  }
  if (b) return <P.NotFoundView />;
  const pages: Record<string, () => React.ReactElement> = {
    body: P.BodyPage, myths: P.MythsPage, compare: P.ComparePage, favorites: P.FavoritesPage,
    about: P.AboutPage, sources: P.SourcesPage, privacy: P.PrivacyPage,
  };
  const Page = pages[a];
  return Page ? <Page /> : <P.NotFoundView />;
}

const TITLES: Record<string, string> = { products: "Продукты", body: "Организм человека", diseases: "Заболевания", prevention: "Профилактика", quizzes: "Тесты", myths: "Миф или факт", compare: "Сравнение", favorites: "Избранное", about: "О проекте", sources: "Источники", privacy: "Конфиденциальность" };

function App() {
  const loc = useLocation();
  useEffect(() => {
    if (loc.anchor) {
      requestAnimationFrame(() => document.getElementById(loc.anchor)?.scrollIntoView({ block: "start" }));
    } else {
      window.scrollTo(0, 0);
    }
    const seg = loc.path.split("/").filter(Boolean);
    const name = seg[1] ? (getProduct(seg[1])?.name ?? getDisease(seg[1])?.name ?? getQuiz(seg[1])?.title) : TITLES[seg[0]];
    document.title = name ? `${name} · Food & Health` : "Food & Health — Узнай, что ты ешь";
  }, [loc.path, loc.search, loc.anchor]);

  return (
    <>
      <a href="#main" className="skip-link">Перейти к содержанию</a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Suspense fallback={<P.Loading />}>
          <Route key={loc.path} path={loc.path} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
