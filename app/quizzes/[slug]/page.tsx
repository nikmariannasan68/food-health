import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getQuiz, quizzes } from "@/content";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { Loading } from "@/components/pages/Pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return quizzes.map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const q = getQuiz(slug);
  return q ? { title: q.title, description: q.description, alternates: { canonical: `/quizzes/${q.slug}` } } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = getQuiz(slug);
  if (!quiz) notFound();
  return (
    <div className="container-page max-w-3xl py-10">
      <Link href="/quizzes" className="text-sm text-muted hover:text-ink">← Все тесты</Link>
      <h1 className="mt-3 mb-6 text-3xl font-extrabold sm:text-4xl">{quiz.title}</h1>
      <Suspense fallback={<Loading />}><QuizRunner quiz={quiz} /></Suspense>
    </div>
  );
}
