import type { Page } from "@playwright/test";
import path from "node:path";

const PREVIEW_URL = "file://" + path.resolve(__dirname, "../../preview/dist/index.html");

/** Переход по маршруту сайта — одинаково для Next.js и превью-сборки. */
export async function go(page: Page, route: string) {
  if (process.env.PREVIEW) await page.goto(`${PREVIEW_URL}#${route}`);
  else await page.goto(route);
}

/** Текущий маршрут без хоста. */
export function routeOf(page: Page): string {
  const u = new URL(page.url());
  return process.env.PREVIEW ? u.hash.slice(1) || "/" : u.pathname + u.search;
}
