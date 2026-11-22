import {
  diseases, nutrients, organs, products, productsForNutrient, tips, myths,
  type NutrientId,
} from "@/content";

export type SearchKind = "product" | "nutrient" | "disease" | "organ" | "tip" | "myth";

export interface SearchResult {
  kind: SearchKind;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  score: number;
}

export const kindLabels: Record<SearchKind, string> = {
  product: "Продукты",
  nutrient: "Компоненты питания",
  disease: "Заболевания",
  organ: "Органы",
  tip: "Профилактика",
  myth: "Мифы и факты",
};

/** Нормализация: нижний регистр, ё → е, без лишних пробелов. */
export function normalize(s: string): string {
  return s.toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ").trim();
}

/** Простое русское «стеммирование»: срезаем типичные окончания, чтобы «сахара», «сахаром» → «сахар». */
export function stem(word: string): string {
  const w = normalize(word);
  if (w.length <= 4) return w;
  return w.replace(/(ами|ями|ого|его|ому|ему|ыми|ими|ых|их|ой|ей|ий|ый|ая|яя|ое|ее|ов|ев|ам|ям|ах|ях|ом|ем|ую|юю|а|я|ы|и|у|ю|е|о)$/u, "");
}

function scoreText(query: string[], text: string, weight: number): number {
  const t = normalize(text);
  let s = 0;
  for (const q of query) {
    if (!q) continue;
    if (t.includes(q)) s += weight;
  }
  return s;
}

export function search(raw: string, limit = 30): SearchResult[] {
  const q = normalize(raw);
  if (q.length < 2) return [];
  const terms = q.split(" ").map(stem).filter((t) => t.length >= 2);
  if (!terms.length) return [];

  const results: SearchResult[] = [];
  const push = (r: Omit<SearchResult, "score">, score: number) => score > 0 && results.push({ ...r, score });

  const matchedNutrients = new Set<NutrientId>();
  for (const n of nutrients) {
    const s = scoreText(terms, n.name, 10) + scoreText(terms, n.aliases.join(" "), 8) + scoreText(terms, n.explainer, 1);
    if (s >= 8) matchedNutrients.add(n.id);
    push({ kind: "nutrient", id: n.id, title: n.name, subtitle: n.explainer.slice(0, 110) + "…", href: `/products?nutrient=${n.id}` }, s);
  }

  for (const p of products) {
    let s = scoreText(terms, p.name, 10) + scoreText(terms, p.summary + " " + p.description, 2) + scoreText(terms, p.typicalFeatures.join(" "), 2);
    // Связи через компонент питания: «сахар» → газировка.
    for (const n of matchedNutrients) if (productsForNutrient(n).some((x) => x.slug === p.slug)) s += 6;
    push({ kind: "product", id: p.slug, title: p.name, subtitle: p.summary, href: `/products/${p.slug}` }, s);
  }

  for (const d of diseases) {
    const s = scoreText(terms, d.name, 10) + scoreText(terms, d.short, 3) + scoreText(terms, d.what + " " + d.riskFactors.join(" ") + d.dietLinks.map((x) => x.text).join(" "), 1);
    push({ kind: "disease", id: d.slug, title: d.name, subtitle: d.short, href: `/diseases/${d.slug}` }, s);
  }

  for (const o of organs) {
    const s = scoreText(terms, o.name, 10) + scoreText(terms, o.system, 3) + scoreText(terms, o.description, 1);
    push({ kind: "organ", id: o.id, title: o.name, subtitle: o.system, href: `/body?organ=${o.id}` }, s);
  }

  for (const t of tips) {
    const s = scoreText(terms, t.title, 8) + scoreText(terms, t.text, 2);
    push({ kind: "tip", id: t.id, title: t.title, subtitle: t.text.slice(0, 110) + "…", href: `/prevention#tip-${t.id}` }, s);
  }

  for (const m of myths) {
    const s = scoreText(terms, m.statement, 4) + scoreText(terms, m.explanation, 1);
    push({ kind: "myth", id: m.id, title: m.statement, subtitle: "Миф или факт?", href: `/myths#${m.id}` }, s);
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function groupResults(results: SearchResult[]): [SearchKind, SearchResult[]][] {
  const order: SearchKind[] = ["product", "nutrient", "disease", "organ", "tip", "myth"];
  return order
    .map((k) => [k, results.filter((r) => r.kind === k)] as [SearchKind, SearchResult[]])
    .filter(([, list]) => list.length > 0);
}
