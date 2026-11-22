"use client";
import Link from "next/link";
import { quizzes } from "@/content";
import { useAppState } from "@/lib/storage";
import { Icon } from "@/components/ui/Icon";

export function QuizCatalog() {
  const { quizzes: results } = useAppState();
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((q, i) => {
        const r = results[q.slug];
        return (
          <Link key={q.slug} href={`/quizzes/${q.slug}`} className="card card-hover animate-fade-up flex flex-col gap-3 p-6" style={{ animationDelay: `${i * 60}ms` }} data-testid="quiz-card">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sci-soft text-sci"><Icon name={q.icon} size={24} /></span>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Тест №{i + 1}</p>
            <h2 className="text-xl font-extrabold">{q.title}</h2>
            <p className="flex-1 text-muted">{q.description}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">{q.questions.length} вопросов</span>
              {r && <span className="chip chip-green"><Icon name="trophy" size={13} />Лучший результат: {r.best}%</span>}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
