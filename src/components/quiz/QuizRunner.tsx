"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getProduct, products, type Question, type Quiz } from "@/content";
import { isCorrect, resultMessage, scoreQuiz, seededShuffle, type Answer } from "@/lib/quiz";
import { saveQuizResult, useAppState } from "@/lib/storage";
import { Icon } from "@/components/ui/Icon";
import { SourceRefs } from "@/components/ui/SourceList";

const MF = [
  { v: "myth", label: "Миф" },
  { v: "fact", label: "Факт" },
  { v: "depends", label: "Зависит от обстоятельств" },
] as const;

const typeHint: Record<Question["type"], string> = {
  single: "Выберите один ответ",
  multiple: "Выберите все верные ответы",
  match: "Сопоставьте пары",
  mythfact: "Миф или факт?",
};

function QuestionBody({ q, answer, setAnswer, locked }: { q: Question; answer: Answer | undefined; setAnswer: (a: Answer) => void; locked: boolean }) {
  const rights = useMemo(() => (q.type === "match" ? seededShuffle(q.pairs.map((_, i) => i), q.id) : []), [q]);

  if (q.type === "single" || q.type === "multiple") {
    const selected = answer?.type === "single" ? [answer.value] : answer?.type === "multiple" ? answer.value : [];
    return (
      <div role={q.type === "single" ? "radiogroup" : "group"} aria-label={q.prompt} className="grid gap-2.5">
        {q.options.map((o, i) => {
          const isSel = selected.includes(i);
          const correctSet = q.type === "single" ? [q.correct] : q.correct;
          const showOk = locked && correctSet.includes(i);
          const showBad = locked && isSel && !correctSet.includes(i);
          return (
            <button
              key={o}
              type="button"
              role={q.type === "single" ? "radio" : "checkbox"}
              aria-checked={isSel}
              disabled={locked}
              onClick={() => {
                if (q.type === "single") setAnswer({ type: "single", value: i });
                else setAnswer({ type: "multiple", value: isSel ? selected.filter((x) => x !== i) : [...selected, i] });
              }}
              className={`flex min-h-12 items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-medium transition-colors disabled:cursor-default ${
                showOk ? "border-good bg-good-soft" : showBad ? "border-risk bg-risk-soft" : isSel ? "border-sci bg-sci-soft" : "border-line bg-surface hover:border-sci"
              }`}
              data-testid="quiz-option"
            >
              <span className={`grid h-6 w-6 shrink-0 place-items-center border-2 ${q.type === "single" ? "rounded-full" : "rounded-md"} ${isSel ? "border-sci bg-sci text-white dark:text-[#0b1530]" : "border-line"}`}>
                {isSel && <Icon name="check" size={14} />}
              </span>
              <span className="flex-1">{o}</span>
              {showOk && <Icon name="check-circle" className="text-good" label="Верный ответ" />}
            </button>
          );
        })}
      </div>
    );
  }

  if (q.type === "mythfact") {
    const v = answer?.type === "mythfact" ? answer.value : undefined;
    return (
      <div role="radiogroup" aria-label={q.prompt} className="grid gap-2.5 sm:grid-cols-3">
        {MF.map((o) => {
          const isSel = v === o.v;
          const ok = locked && q.answer === o.v;
          const bad = locked && isSel && q.answer !== o.v;
          return (
            <button key={o.v} type="button" role="radio" aria-checked={isSel} disabled={locked}
              onClick={() => setAnswer({ type: "mythfact", value: o.v })}
              className={`min-h-14 rounded-2xl border-2 px-4 py-3 font-bold transition-colors disabled:cursor-default ${ok ? "border-good bg-good-soft text-good" : bad ? "border-risk bg-risk-soft text-risk" : isSel ? "border-sci bg-sci-soft text-sci" : "border-line bg-surface hover:border-sci"}`}
              data-testid={`mf-${o.v}`}
            >{o.label}</button>
          );
        })}
      </div>
    );
  }

  // match
  const value = answer?.type === "match" ? answer.value : {};
  return (
    <div className="grid gap-3">
      {q.pairs.map((p, i) => {
        const chosen = value[i];
        const ok = locked && chosen === i;
        const bad = locked && chosen !== i;
        return (
          <div key={p.left} className={`grid items-center gap-2 rounded-2xl border-2 p-3 sm:grid-cols-[1fr_auto_1.2fr] ${ok ? "border-good bg-good-soft" : bad ? "border-risk bg-risk-soft" : "border-line bg-surface"}`}>
            <label htmlFor={`${q.id}-m${i}`} className="font-semibold">{p.left}</label>
            <Icon name="arrow-right" className="hidden text-muted sm:block" />
            <select
              id={`${q.id}-m${i}`}
              disabled={locked}
              value={chosen ?? ""}
              onChange={(e) => setAnswer({ type: "match", value: { ...value, [i]: Number(e.target.value) } })}
              className="min-h-11 w-full rounded-xl border border-line bg-surface px-3 text-ink"
              data-testid="match-select"
            >
              <option value="" disabled>Выберите…</option>
              {rights.map((r) => <option key={r} value={r}>{q.pairs[r].right}</option>)}
            </select>
            {bad && <p className="text-sm text-risk sm:col-span-3">Верно: {p.right}</p>}
          </div>
        );
      })}
    </div>
  );
}

function answered(q: Question, a: Answer | undefined) {
  if (!a) return false;
  if (a.type === "multiple") return a.value.length > 0;
  if (a.type === "match") return q.type === "match" && q.pairs.every((_, i) => a.value[i] !== undefined);
  return true;
}

export function QuizRunner({ quiz }: { quiz: Quiz }) {
  const params = useSearchParams();
  const from = params?.get("from") ?? null;
  const state = useAppState();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer | undefined>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);

  const q = quiz.questions[idx];
  const a = answers[q.id];
  const locked = !!checked[q.id];

  function check() {
    setChecked((c) => ({ ...c, [q.id]: true }));
  }
  function next() {
    if (idx < quiz.questions.length - 1) setIdx(idx + 1);
    else {
      const r = scoreQuiz(quiz, answers);
      saveQuizResult(quiz.slug, r.percent);
      setDone(true);
    }
  }
  function restart() {
    setIdx(0); setAnswers({}); setChecked({}); setDone(false);
  }

  if (done) {
    const r = scoreQuiz(quiz, answers);
    const fromProduct = from ? getProduct(from) : undefined;
    const viewed = new Set(state.viewed);
    const nextProduct = products.find((p) => p.slug !== from && !viewed.has(`product:${p.slug}`)) ?? products.find((p) => p.slug !== from);
    return (
      <div className="card animate-pop p-6 text-center sm:p-10" data-testid="quiz-result">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-good-soft text-good"><Icon name="trophy" size={32} /></span>
        <h2 className="mt-4 text-3xl font-extrabold">Тест пройден!</h2>
        <p className="mt-2 text-muted">{resultMessage(r.percent)}</p>
        <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3">
          <div className="rounded-2xl bg-surface-2 p-4"><p className="font-display text-3xl font-extrabold tabular-nums" data-testid="quiz-score">{r.correct} из {r.total}</p><p className="text-sm text-muted">правильных ответов</p></div>
          <div className="rounded-2xl bg-surface-2 p-4"><p className="font-display text-3xl font-extrabold tabular-nums" data-testid="quiz-percent">{r.percent}%</p><p className="text-sm text-muted">результат</p></div>
        </div>
        {r.reviewTopics.length > 0 && (
          <div className="mx-auto mt-6 max-w-md text-left">
            <h3 className="mb-2 font-bold">Темы для повторения</h3>
            <div className="flex flex-wrap gap-2">{r.reviewTopics.map((t) => <span key={t} className="chip chip-orange">{t}</span>)}</div>
          </div>
        )}
        <p className="mx-auto mt-6 max-w-md text-xs text-muted">Результат теста отражает знания по теме и не является оценкой состояния здоровья.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={restart} className="btn btn-secondary" data-testid="quiz-retry"><Icon name="refresh" size={18} />Пройти ещё раз</button>
          {nextProduct && (
            <Link href={`/products/${nextProduct.slug}`} className="btn btn-primary" data-testid="quiz-next-product">
              Изучить следующий продукт: {nextProduct.name}<Icon name="arrow-right" size={18} />
            </Link>
          )}
          {fromProduct && <Link href={`/products/${fromProduct.slug}`} className="btn btn-ghost">Вернуться к «{fromProduct.name}»</Link>}
          <Link href="/quizzes" className="btn btn-ghost">Все тесты</Link>
        </div>
      </div>
    );
  }

  const ok = locked && isCorrect(q, a);
  return (
    <div data-testid="quiz-runner">
      <div className="mb-4 flex items-center gap-3">
        <div className="meter flex-1" role="progressbar" aria-label="Прогресс теста" aria-valuemin={1} aria-valuemax={quiz.questions.length} aria-valuenow={idx + 1}>
          <span style={{ width: `${((idx + (locked ? 1 : 0)) / quiz.questions.length) * 100}%`, background: "var(--blue)" }} />
        </div>
        <span className="text-sm font-semibold tabular-nums text-muted" data-testid="quiz-counter">{idx + 1} / {quiz.questions.length}</span>
      </div>
      <div className="card p-5 sm:p-8" key={q.id}>
        <p className="eyebrow !text-sci">{typeHint[q.type]}</p>
        <h2 className="mt-2 mb-6 text-xl font-bold sm:text-2xl" data-testid="quiz-prompt">{q.prompt}</h2>
        <QuestionBody q={q} answer={a} setAnswer={(x) => setAnswers((s) => ({ ...s, [q.id]: x }))} locked={locked} />

        {locked && (
          <div className={`animate-pop mt-6 rounded-2xl p-4 ${ok ? "bg-good-soft" : "bg-warn-soft"}`} role="status" data-testid="quiz-feedback">
            <p className={`flex items-center gap-2 font-bold ${ok ? "text-good" : "text-warn"}`}>
              <Icon name={ok ? "check-circle" : "info"} />{ok ? "Верно!" : "Не совсем так"}
            </p>
            <p className="mt-1.5">{q.explanation}</p>
            {q.sourceIds && <SourceRefs ids={q.sourceIds} />}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          {!locked ? (
            <button type="button" className="btn btn-primary" disabled={!answered(q, a)} onClick={check} data-testid="quiz-check">Проверить</button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={next} data-testid="quiz-next">
              {idx < quiz.questions.length - 1 ? "Следующий вопрос" : "Узнать результат"}<Icon name="arrow-right" size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
