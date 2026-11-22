/**
 * Слой медицинского контента: проверенные данные + функции доступа.
 * Компоненты не импортируют сырые файлы данных напрямую — только отсюда.
 */
import { z } from "zod";
import {
  DiseaseSchema, MythSchema, NutrientSchema, OrganSchema, ProductSchema, QuizSchema, SourceSchema, TipSchema,
  type Category, type Disease, type NutrientId, type OrganId, type Product,
} from "./schema";
import { sources as rawSources } from "./sources";
import { products as rawProducts } from "./products";
import { diseases as rawDiseases } from "./diseases";
import { organs as rawOrgans } from "./organs";
import { nutrients as rawNutrients } from "./nutrients";
import { tips as rawTips } from "./tips";
import { quizzes as rawQuizzes } from "./quizzes";
import { myths as rawMyths } from "./myths";

export * from "./schema";

function parse<T>(schema: z.ZodType<T>, data: unknown, label: string): T {
  const r = schema.safeParse(data);
  if (!r.success) {
    throw new Error(`Ошибка в данных «${label}»: ${r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
  }
  return r.data;
}

export const sources = parse(z.array(SourceSchema), rawSources, "sources");
export const products = parse(z.array(ProductSchema), rawProducts, "products");
export const diseases = parse(z.array(DiseaseSchema), rawDiseases, "diseases");
export const organs = parse(z.array(OrganSchema), rawOrgans, "organs");
export const nutrients = parse(z.array(NutrientSchema), rawNutrients, "nutrients");
export const tips = parse(z.array(TipSchema), rawTips, "tips");
export const quizzes = parse(z.array(QuizSchema), rawQuizzes, "quizzes");
export const myths = parse(z.array(MythSchema), rawMyths, "myths");

export const categoryLabels: Record<Category, string> = {
  drinks: "Напитки",
  fastfood: "Фастфуд",
  sweets: "Сладости",
  salty: "Солёные закуски",
  processed: "Переработанные продукты",
};

export const evidenceLabels = {
  direct: { label: "Прямой эффект", hint: "Физиологическое действие вскоре после употребления" },
  causal: { label: "Доказанная причинная связь", hint: "Признана ведущими организациями здравоохранения" },
  association: { label: "Статистическая связь", hint: "Наблюдается в исследованиях, причинность не доказана" },
  "diet-pattern": { label: "Влияние рациона в целом", hint: "Зависит от общего питания, а не от одного продукта" },
} as const;

export const confidenceLabels = { high: "Высокая", moderate: "Умеренная", low: "Ограниченная" } as const;

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getDisease = (slug: string) => diseases.find((d) => d.slug === slug);
export const getOrgan = (id: OrganId) => organs.find((o) => o.id === id)!;
export const getNutrient = (id: NutrientId) => nutrients.find((n) => n.id === id)!;
export const getQuiz = (slug: string) => quizzes.find((q) => q.slug === slug);
export const getTip = (id: string) => tips.find((t) => t.id === id);
export const getSource = (id: string) => sources.find((s) => s.id === id);
export const getSources = (ids: string[]) => [...new Set(ids)].map(getSource).filter((s): s is NonNullable<typeof s> => Boolean(s));

/** Продукты, у которых есть эффект, связанный с данным заболеванием. */
export function productsForDisease(slug: string): Product[] {
  return products.filter((p) => p.effects.some((e) => e.diseaseSlugs.includes(slug)));
}

/** Продукты, влияющие на орган. */
export function productsForOrgan(id: OrganId): Product[] {
  return products.filter((p) => p.effects.some((e) => e.organ === id));
}

export function diseasesForOrgan(id: OrganId): Disease[] {
  return diseases.filter((d) => d.organs.includes(id));
}

export function diseasesForProduct(p: Product): Disease[] {
  const slugs = new Set(p.effects.flatMap((e) => e.diseaseSlugs));
  return diseases.filter((d) => slugs.has(d.slug));
}

/** Связанные материалы для блока «Вам также может быть интересно». */
export function relatedProducts(p: Product, limit = 3): Product[] {
  const myFactors = new Set(p.keyFactors.map((k) => k.nutrient));
  const myDiseases = new Set(p.effects.flatMap((e) => e.diseaseSlugs));
  return products
    .filter((o) => o.slug !== p.slug)
    .map((o) => {
      let score = 0;
      o.keyFactors.forEach((k) => myFactors.has(k.nutrient) && (score += 2));
      o.effects.forEach((e) => e.diseaseSlugs.forEach((d) => myDiseases.has(d) && (score += 1)));
      o.categories.forEach((c) => p.categories.includes(c) && (score += 1));
      return { o, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.o);
}

/** Продукты, где данный нутриент — значимый фактор. */
export function productsForNutrient(id: NutrientId): Product[] {
  return products.filter((p) => p.keyFactors.some((k) => k.nutrient === id) || p.effects.some((e) => e.factor === id));
}
