import type { MetadataRoute } from "next";
import { diseases, products, quizzes } from "@/content";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/products", "/body", "/diseases", "/prevention", "/prevention/habits", "/quizzes", "/myths", "/compare", "/about", "/sources", "/privacy"];
  return [
    ...staticRoutes.map((r) => ({ url: `${SITE.url}${r}`, changeFrequency: "weekly" as const, priority: r === "" ? 1 : 0.7 })),
    ...products.map((p) => ({ url: `${SITE.url}/products/${p.slug}`, lastModified: p.reviewedAt, priority: 0.8 })),
    ...diseases.map((d) => ({ url: `${SITE.url}/diseases/${d.slug}`, lastModified: d.reviewedAt, priority: 0.8 })),
    ...quizzes.map((q) => ({ url: `${SITE.url}/quizzes/${q.slug}`, priority: 0.6 })),
  ];
}
