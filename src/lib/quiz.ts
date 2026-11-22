import type { Question, Quiz } from "@/content";

export type Answer =
  | { type: "single"; value: number }
  | { type: "multiple"; value: number[] }
  | { type: "match"; value: Record<number, number> } // индекс левой части → индекс правой (в исходном порядке)
  | { type: "mythfact"; value: "myth" | "fact" | "depends" };

export function isCorrect(q: Question, a: Answer | undefined): boolean {
  if (!a || a.type !== q.type) return false;
  switch (q.type) {
    case "single":
      return (a as Extract<Answer, { type: "single" }>).value === q.correct;
    case "multiple": {
      const v = [...(a as Extract<Answer, { type: "multiple" }>).value].sort();
      const c = [...q.correct].sort();
      return v.length === c.length && v.every((x, i) => x === c[i]);
    }
    case "match": {
      const v = (a as Extract<Answer, { type: "match" }>).value;
      return q.pairs.every((_, i) => v[i] === i);
    }
    case "mythfact":
      return (a as Extract<Answer, { type: "mythfact" }>).value === q.answer;
  }
}

export interface QuizResult {
  correct: number;
  total: number;
  percent: number;
  reviewTopics: string[];
}

export function scoreQuiz(quiz: Quiz, answers: Record<string, Answer | undefined>): QuizResult {
  let correct = 0;
  const wrongTopics = new Set<string>();
  for (const q of quiz.questions) {
    if (isCorrect(q, answers[q.id])) correct++;
    else wrongTopics.add(q.topic);
  }
  const total = quiz.questions.length;
  return { correct, total, percent: Math.round((correct / total) * 100), reviewTopics: [...wrongTopics] };
}

/** Детерминированное перемешивание (одинаково на сервере и клиенте). */
export function seededShuffle<T>(arr: T[], seed: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const out = arr.map((v, i) => ({ v, i }));
  const rand = () => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out.map((x) => x.v);
}

export function resultMessage(percent: number): string {
  if (percent >= 90) return "Отличный результат! Вы хорошо разбираетесь в теме.";
  if (percent >= 60) return "Хороший результат. Посмотрите темы для повторения — и будет ещё лучше.";
  return "Хорошее начало! Объяснения к вопросам помогут разобраться — попробуйте ещё раз.";
}
