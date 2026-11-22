import { test } from "node:test";
import assert from "node:assert/strict";
import { getQuiz } from "../../src/content";
import { search, groupResults, normalize, stem } from "../../src/lib/search";
import { isCorrect, scoreQuiz, seededShuffle } from "../../src/lib/quiz";
import { fmtAmount, plural } from "../../src/lib/format";

test("поиск: «сахар» находит продукт, компонент, заболевания и рекомендации", () => {
  const r = search("сахар");
  const kinds = new Set(r.map((x) => x.kind));
  for (const k of ["product", "nutrient", "disease", "tip"] as const) assert.ok(kinds.has(k), `нет результатов типа ${k}`);
  const firstProduct = r.find((x) => x.kind === "product")!;
  assert.equal(firstProduct.id, "soda");
  assert.ok(r.some((x) => x.kind === "disease" && x.id === "caries"));
});

test("поиск: словоформы и регистр", () => {
  assert.equal(stem("сахара"), stem("сахар"));
  assert.equal(normalize("  ЁЖ  "), "еж");
  assert.ok(search("Кофеином").some((x) => x.id === "coffee"));
  assert.ok(search("зубы").some((x) => x.kind === "organ" && x.id === "teeth"));
  assert.ok(search("давление").some((x) => x.kind === "disease" && x.id === "hypertension"));
});

test("поиск: пустой и бессмысленный запрос", () => {
  assert.deepEqual(search(""), []);
  assert.deepEqual(search("я"), []);
  assert.deepEqual(search("zzzzqqq"), []);
  assert.deepEqual(groupResults([]), []);
});

test("оценка тестов: все типы вопросов", () => {
  const quiz = getQuiz("sugar")!;
  const answers: Record<string, any> = {};
  for (const q of quiz.questions) {
    if (q.type === "single") answers[q.id] = { type: "single", value: q.correct };
    if (q.type === "multiple") answers[q.id] = { type: "multiple", value: [...q.correct].reverse() };
    if (q.type === "match") answers[q.id] = { type: "match", value: Object.fromEntries(q.pairs.map((_, i) => [i, i])) };
    if (q.type === "mythfact") answers[q.id] = { type: "mythfact", value: q.answer };
  }
  const r = scoreQuiz(quiz, answers);
  assert.equal(r.correct, quiz.questions.length);
  assert.equal(r.percent, 100);
  assert.deepEqual(r.reviewTopics, []);

  const empty = scoreQuiz(quiz, {});
  assert.equal(empty.correct, 0);
  assert.ok(empty.reviewTopics.length > 0);

  const multi = quiz.questions.find((q) => q.type === "multiple")!;
  assert.equal(isCorrect(multi, { type: "multiple", value: [0] }), false, "частичный ответ не засчитывается");
});

test("детерминированное перемешивание", () => {
  const a = seededShuffle([1, 2, 3, 4, 5], "x");
  assert.deepEqual(a, seededShuffle([1, 2, 3, 4, 5], "x"));
  assert.deepEqual([...a].sort(), [1, 2, 3, 4, 5]);
});

test("форматирование значений и «Данные уточняются»", () => {
  assert.equal(fmtAmount({ kind: "range", min: 9, max: 11 }, "г"), "9–11 г");
  assert.equal(fmtAmount({ kind: "exact", value: 1.5 }, "г"), "1,5 г");
  assert.equal(fmtAmount({ kind: "unknown" }, "г"), "Данные уточняются");
  assert.equal(fmtAmount(undefined, "г"), "Данные уточняются");
  assert.equal(plural(1, "день", "дня", "дней"), "день");
  assert.equal(plural(3, "день", "дня", "дней"), "дня");
  assert.equal(plural(11, "день", "дня", "дней"), "дней");
});
