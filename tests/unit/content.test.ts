import { test } from "node:test";
import assert from "node:assert/strict";
import {
  diseases, getDisease, getQuiz, getSource, getTip, myths, nutrients, organs, products, quizzes, sources, tips,
  diseasesForProduct, productsForDisease, relatedProducts,
} from "../../src/content";

test("данные проходят Zod-валидацию и не пусты", () => {
  assert.ok(products.length >= 3);
  assert.ok(diseases.length >= 6);
  assert.equal(organs.length, 10);
  assert.ok(quizzes.length >= 5);
  assert.ok(myths.length >= 5);
  assert.ok(sources.length >= 10);
});

test("идентификаторы уникальны", () => {
  for (const [name, ids] of [
    ["products", products.map((p) => p.slug)],
    ["diseases", diseases.map((d) => d.slug)],
    ["sources", sources.map((s) => s.id)],
    ["quizzes", quizzes.map((q) => q.slug)],
    ["tips", tips.map((t) => t.id)],
    ["myths", myths.map((m) => m.id)],
  ] as const) {
    assert.equal(new Set(ids).size, ids.length, `дубликаты в ${name}`);
  }
});

test("все ссылки на источники существуют и ведут на https", () => {
  const all: string[] = [
    ...products.flatMap((p) => [...p.sourceIds, ...p.nutrients.flatMap((n) => n.sourceIds), ...p.effects.flatMap((e) => e.sourceIds), ...p.beforeAfter.flatMap((b) => b.sourceIds)]),
    ...diseases.flatMap((d) => [...d.sourceIds, ...d.dietLinks.flatMap((l) => l.sourceIds)]),
    ...tips.flatMap((t) => t.sourceIds),
    ...myths.flatMap((m) => m.sourceIds),
    ...nutrients.flatMap((n) => n.sourceIds),
    ...quizzes.flatMap((q) => q.questions.flatMap((x) => x.sourceIds ?? [])),
  ];
  for (const id of all) assert.ok(getSource(id), `нет источника ${id}`);
  for (const s of sources) assert.match(s.url, /^https:\/\//);
});

test("связи продуктов ведут на существующие заболевания, тесты и советы", () => {
  for (const p of products) {
    assert.ok(getQuiz(p.quizSlug), `${p.slug}: нет теста ${p.quizSlug}`);
    for (const t of p.tipIds) assert.ok(getTip(t), `${p.slug}: нет совета ${t}`);
    for (const e of p.effects) for (const d of e.diseaseSlugs) assert.ok(getDisease(d), `${p.slug}: нет заболевания ${d}`);
    assert.ok(p.effects.length > 0);
  }
});

test("значения состава честно размечены", () => {
  for (const p of products) {
    for (const n of p.nutrients) {
      if (n.per100.kind === "range") assert.ok(n.per100.min <= n.per100.max, `${p.slug}/${n.nutrient}: min > max`);
      if (n.status === "unknown") assert.equal(n.per100.kind, "unknown", `${p.slug}/${n.nutrient}: статус unknown, но есть число`);
      if (n.per100.kind === "unknown") assert.equal(n.status, "unknown");
      if (n.status === "sourced") assert.ok(n.sourceIds.length > 0, `${p.slug}/${n.nutrient}: sourced без источника`);
    }
    for (const b of p.beforeAfter) {
      const hasUnknown = b.rows.some((r) => r.before.kind === "unknown" || r.after.kind === "unknown");
      if (hasUnknown) assert.notEqual(b.status, "sourced", `${p.slug}: «Было/Стало» с неизвестными данными не может быть sourced`);
    }
  }
});

test("сценарий ТЗ: газировка → зубы → кариес (доказанная связь)", () => {
  const soda = products.find((p) => p.slug === "soda")!;
  const teeth = soda.effects.find((e) => e.organ === "teeth")!;
  assert.ok(teeth);
  assert.equal(teeth.evidence, "causal");
  assert.ok(teeth.diseaseSlugs.includes("caries"));
  const pancreas = soda.effects.find((e) => e.organ === "pancreas")!;
  assert.equal(pancreas.evidence, "association", "связь с диабетом — ассоциация, а не доказанная причинность");
  assert.ok(diseasesForProduct(soda).some((d) => d.slug === "caries"));
  assert.ok(productsForDisease("caries").some((p) => p.slug === "soda"));
});

test("вопросы тестов корректны", () => {
  for (const q of quizzes) {
    assert.ok(q.questions.length >= 5 && q.questions.length <= 10, `${q.slug}: 5–10 вопросов`);
    const types = new Set(q.questions.map((x) => x.type));
    assert.ok(types.size >= 2, `${q.slug}: разные типы вопросов`);
    for (const x of q.questions) {
      if (x.type === "single") assert.ok(x.correct >= 0 && x.correct < x.options.length, `${x.id}`);
      if (x.type === "multiple") for (const c of x.correct) assert.ok(c >= 0 && c < x.options.length, `${x.id}`);
      if (x.type === "match") assert.equal(new Set(x.pairs.map((p) => p.right)).size, x.pairs.length, `${x.id}: повтор правой части`);
    }
  }
  const allTypes = new Set(quizzes.flatMap((q) => q.questions.map((x) => x.type)));
  assert.deepEqual([...allTypes].sort(), ["match", "multiple", "mythfact", "single"]);
});

test("мифы включают вариант «Зависит от обстоятельств»", () => {
  assert.ok(myths.some((m) => m.answer === "depends"));
});

test("связанные материалы не включают сам продукт", () => {
  for (const p of products) assert.ok(!relatedProducts(p).some((r) => r.slug === p.slug));
});
