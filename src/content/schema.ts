/**
 * Модель данных медицинского и образовательного контента.
 * Все данные проходят проверку Zod при загрузке (см. src/content/index.ts),
 * поэтому ошибка в файле данных обнаружится сразу — в тестах и при сборке.
 */
import { z } from "zod";

export const isoDate = z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, "Дата в формате ГГГГ-ММ или ГГГГ-ММ-ДД");

export const SourceSchema = z.object({
  id: z.string(),
  org: z.string(),
  title: z.string(),
  url: z.string().url(),
  kind: z.enum(["guideline", "factsheet", "systematic-review", "review", "study", "scientific-opinion", "consumer-info", "database"]),
  /** Дата публикации или последнего обновления, как указано на странице источника. */
  date: isoDate.optional(),
  dateLabel: z.enum(["published", "updated"]).optional(),
  /** Когда редакция последний раз открывала и сверяла источник. */
  accessed: isoDate,
  note: z.string().optional(),
});
export type Source = z.infer<typeof SourceSchema>;

export const NutrientIdSchema = z.enum(["energy", "sugar", "salt", "fat", "satFat", "caffeine", "fiber"]);
export type NutrientId = z.infer<typeof NutrientIdSchema>;

export const OrganIdSchema = z.enum([
  "brain", "heart", "vessels", "stomach", "intestine", "liver", "pancreas", "kidneys", "teeth", "bones",
]);
export type OrganId = z.infer<typeof OrganIdSchema>;

/**
 * Значение показателя. Три честных состояния:
 *  - exact: конкретное число из указанного источника;
 *  - range: ориентировочный диапазон (типичные значения, зависят от марки/рецепта);
 *  - unknown: данные уточняются — показываем явно, не придумываем.
 */
export const AmountSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("exact"), value: z.number().nonnegative() }),
  z.object({ kind: z.literal("range"), min: z.number().nonnegative(), max: z.number().nonnegative() }),
  z.object({ kind: z.literal("unknown") }),
]);
export type Amount = z.infer<typeof AmountSchema>;

export const DataStatusSchema = z.enum(["sourced", "approximate", "unknown"]);
export type DataStatus = z.infer<typeof DataStatusSchema>;

export const NutrientValueSchema = z.object({
  nutrient: NutrientIdSchema,
  per100: AmountSchema,
  perServing: AmountSchema.optional(),
  status: DataStatusSchema,
  sourceIds: z.array(z.string()),
  note: z.string().optional(),
});
export type NutrientValue = z.infer<typeof NutrientValueSchema>;

/**
 * Тип доказательств — чтобы не смешивать разные виды связей.
 *  - direct: прямой краткосрочный физиологический эффект (например, кофеин и бодрость);
 *  - causal: причинно-следственная связь, признанная крупными организациями (сахар → кариес);
 *  - association: статистическая связь в наблюдательных исследованиях, причинность не доказана;
 *  - diet-pattern: эффект относится к рациону в целом, а не к отдельному продукту.
 */
export const EvidenceTypeSchema = z.enum(["direct", "causal", "association", "diet-pattern"]);
export type EvidenceType = z.infer<typeof EvidenceTypeSchema>;

export const ConfidenceSchema = z.enum(["high", "moderate", "low"]);
export type Confidence = z.infer<typeof ConfidenceSchema>;

export const TimeframeSchema = z.enum(["short", "long"]);

export const OrganEffectSchema = z.object({
  organ: OrganIdSchema,
  title: z.string(),
  text: z.string(),
  factor: NutrientIdSchema,
  evidence: EvidenceTypeSchema,
  confidence: ConfidenceSchema,
  timeframe: TimeframeSchema,
  diseaseSlugs: z.array(z.string()),
  sourceIds: z.array(z.string()).min(1),
});
export type OrganEffect = z.infer<typeof OrganEffectSchema>;

export const ComparisonRowSchema = z.object({
  label: z.string(),
  unit: z.string(),
  before: AmountSchema,
  after: AmountSchema,
});

export const BeforeAfterSchema = z.object({
  before: z.string(),
  after: z.string(),
  portion: z.string(),
  rows: z.array(ComparisonRowSchema),
  status: DataStatusSchema,
  sourceIds: z.array(z.string()),
  note: z.string().optional(),
});
export type BeforeAfter = z.infer<typeof BeforeAfterSchema>;

export const CategorySchema = z.enum(["drinks", "fastfood", "sweets", "salty", "processed"]);
export type Category = z.infer<typeof CategorySchema>;

export const ProductSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  categories: z.array(CategorySchema).min(1),
  art: z.string(),
  imageAlt: z.string(),
  unit: z.enum(["g", "ml"]),
  serving: z.object({ size: z.number().positive(), label: z.string() }),
  summary: z.string(),
  description: z.string(),
  typicalFeatures: z.array(z.string()),
  notice: z.string(),
  nutrients: z.array(NutrientValueSchema),
  keyFactors: z.array(z.object({ nutrient: NutrientIdSchema, text: z.string() })),
  effects: z.array(OrganEffectSchema),
  prevention: z.array(z.string()),
  alternatives: z.array(z.object({ from: z.string(), to: z.string(), why: z.string(), caution: z.string().optional() })),
  beforeAfter: z.array(BeforeAfterSchema),
  quizSlug: z.string(),
  tipIds: z.array(z.string()),
  sourceIds: z.array(z.string()).min(1),
  reviewedAt: isoDate,
  medicalReview: z.enum(["pending", "done"]),
});
export type Product = z.infer<typeof ProductSchema>;

export const EvidenceStatementSchema = z.object({
  text: z.string(),
  evidence: EvidenceTypeSchema,
  confidence: ConfidenceSchema,
  sourceIds: z.array(z.string()).min(1),
});

export const DiseaseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  short: z.string(),
  organs: z.array(OrganIdSchema),
  what: z.string(),
  riskFactors: z.array(z.string()),
  dietLinks: z.array(EvidenceStatementSchema),
  mechanism: z.string(),
  symptoms: z.array(z.string()),
  prevention: z.array(z.string()),
  whenToSeeDoctor: z.array(z.string()),
  sourceIds: z.array(z.string()).min(1),
  reviewedAt: isoDate,
  medicalReview: z.enum(["pending", "done"]),
});
export type Disease = z.infer<typeof DiseaseSchema>;

export const OrganSchema = z.object({
  id: OrganIdSchema,
  name: z.string(),
  system: z.string(),
  description: z.string(),
});
export type Organ = z.infer<typeof OrganSchema>;

export const NutrientSchema = z.object({
  id: NutrientIdSchema,
  name: z.string(),
  short: z.string(),
  unit: z.string(),
  aliases: z.array(z.string()),
  explainer: z.string(),
  guideline: z.string().optional(),
  /** Ориентир для шкалы на 100 г/мл: «высокое содержание» — для визуализации, не норма. */
  scaleMax: z.number().positive(),
  sourceIds: z.array(z.string()),
});
export type Nutrient = z.infer<typeof NutrientSchema>;

export const TipSchema = z.object({
  id: z.string(),
  title: z.string(),
  text: z.string(),
  icon: z.string(),
  tone: z.enum(["green", "blue", "orange"]),
  sourceIds: z.array(z.string()).min(1),
});
export type Tip = z.infer<typeof TipSchema>;

const QuestionBase = {
  id: z.string(),
  prompt: z.string(),
  explanation: z.string(),
  topic: z.string(),
  sourceIds: z.array(z.string()).optional(),
};

export const QuestionSchema = z.discriminatedUnion("type", [
  z.object({ ...QuestionBase, type: z.literal("single"), options: z.array(z.string()).min(2), correct: z.number().int() }),
  z.object({ ...QuestionBase, type: z.literal("multiple"), options: z.array(z.string()).min(2), correct: z.array(z.number().int()).min(1) }),
  z.object({ ...QuestionBase, type: z.literal("match"), pairs: z.array(z.object({ left: z.string(), right: z.string() })).min(2) }),
  z.object({ ...QuestionBase, type: z.literal("mythfact"), answer: z.enum(["myth", "fact", "depends"]) }),
]);
export type Question = z.infer<typeof QuestionSchema>;

export const QuizSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  questions: z.array(QuestionSchema).min(5).max(10),
});
export type Quiz = z.infer<typeof QuizSchema>;

export const MythSchema = z.object({
  id: z.string(),
  statement: z.string(),
  answer: z.enum(["myth", "fact", "depends"]),
  explanation: z.string(),
  sourceIds: z.array(z.string()).min(1),
});
export type Myth = z.infer<typeof MythSchema>;
