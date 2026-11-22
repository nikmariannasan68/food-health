import { expect, test, type Page } from "@playwright/test";
import { getQuiz, products } from "../../src/content";
import { go, routeOf } from "./helpers";

async function answerQuizCorrectly(page: Page, slug: string) {
  const quiz = getQuiz(slug)!;
  for (const q of quiz.questions) {
    await expect(page.getByTestId("quiz-prompt")).toHaveText(q.prompt);
    if (q.type === "single") await page.getByTestId("quiz-option").nth(q.correct).click();
    if (q.type === "multiple") for (const c of q.correct) await page.getByTestId("quiz-option").nth(c).click();
    if (q.type === "mythfact") await page.getByTestId(`mf-${q.answer}`).click();
    if (q.type === "match") {
      const selects = page.getByTestId("match-select");
      for (let i = 0; i < q.pairs.length; i++) await selects.nth(i).selectOption({ label: q.pairs[i].right });
    }
    await page.getByTestId("quiz-check").click();
    await expect(page.getByTestId("quiz-feedback")).toContainText("Верно");
    await page.getByTestId("quiz-next").click();
  }
}

test("полный сценарий ТЗ: газировка → зубы → профилактика → тест → следующий продукт", async ({ page }) => {
  await go(page, "/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Знаешь ли ты");
  await expect(page.getByTestId("product-card")).toHaveCount(products.length);

  await page.getByRole("link", { name: "Узнать больше: Сладкая газировка" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Сладкая газировка");
  await expect(page.getByTestId("nutrient-value-sugar")).toHaveText("9–11 г");
  await page.getByTestId("basis-serving").click();
  await expect(page.getByTestId("nutrient-value-sugar")).toHaveText("30–40 г");

  await page.getByTestId("cta-body-2").click();
  await expect(page.getByTestId("body-map")).toBeInViewport();
  await page.locator('[data-organ="teeth"]').click();
  const panel = page.getByTestId("organ-panel");
  await expect(panel).toContainText("Сахар и кариес");
  await expect(panel).toContainText("Доказанная причинная связь");

  // Поджелудочная — ассоциация, не причинность
  await page.getByTestId("organ-btn-pancreas").click();
  await expect(panel).toContainText("Статистическая связь");
  await page.locator('[data-organ="teeth"]').click();

  await panel.getByTestId("to-prevention").click();
  await expect(page.getByTestId("prevention-view")).toBeVisible();
  expect(routeOf(page)).toContain("product=soda");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Что можно сделать, чтобы снизить риски?");
  await expect(page.getByTestId("alternative").first()).toContainText("Вода");
  await expect(page.getByTestId("before-after").first()).toContainText("Было");
  await expect(page.locator("#tip-oral-care")).toBeVisible();

  await page.getByTestId("prevention-to-quiz").click();
  await expect(page.getByTestId("quiz-runner")).toBeVisible();
  await answerQuizCorrectly(page, "sugar");
  await expect(page.getByTestId("quiz-percent")).toHaveText("100%");
  await page.getByTestId("quiz-next-product").click();
  await expect(page.getByTestId("product-view")).toBeVisible();
  expect(routeOf(page)).toMatch(/\/products\//);
  expect(routeOf(page)).not.toContain("/products/soda");
});

test("тест: неверный ответ, темы для повторения и повторное прохождение", async ({ page }) => {
  await go(page, "/quizzes/salt");
  const quiz = getQuiz("salt")!;
  for (const q of quiz.questions) {
    if (q.type === "single") await page.getByTestId("quiz-option").nth((q.correct + 1) % q.options.length).click();
    if (q.type === "multiple") await page.getByTestId("quiz-option").nth(3).click();
    if (q.type === "mythfact") await page.getByTestId(`mf-${q.answer === "fact" ? "myth" : "fact"}`).click();
    await page.getByTestId("quiz-check").click();
    await expect(page.getByTestId("quiz-feedback")).toContainText("Не совсем");
    await page.getByTestId("quiz-next").click();
  }
  await expect(page.getByTestId("quiz-percent")).toHaveText("0%");
  await expect(page.getByTestId("quiz-result")).toContainText("Темы для повторения");
  await page.getByTestId("quiz-retry").click();
  await expect(page.getByTestId("quiz-counter")).toHaveText(`1 / ${quiz.questions.length}`);
});

test("каталог: фильтры, поиск и пустое состояние", async ({ page }) => {
  await go(page, "/products");
  await expect(page.getByTestId("product-card")).toHaveCount(products.length);
  await page.getByTestId("filter-drinks").click();
  await expect(page.getByTestId("product-card")).toHaveCount(products.filter((p) => p.categories.includes("drinks")).length);
  await page.getByTestId("filter-sweets").click();
  await expect(page.getByTestId("product-card")).toContainText(["Шоколад"]);
  await page.getByTestId("filter-fastfood").click();
  await expect(page.getByTestId("catalog-empty")).toBeVisible();
  await page.getByTestId("filter-all").click();
  await page.getByTestId("catalog-search").fill("чип");
  await expect(page.getByTestId("product-card")).toHaveCount(1);
});

test("умный поиск: «сахар» показывает продукты, компоненты, заболевания", async ({ page }) => {
  await go(page, "/");
  await page.getByTestId("search-open").click();
  await page.getByTestId("search-input").fill("сахар");
  const dialog = page.getByTestId("search-dialog");
  for (const g of ["Продукты", "Компоненты питания", "Заболевания", "Профилактика"]) await expect(dialog).toContainText(g);
  await dialog.getByTestId("search-result").filter({ hasText: "Сладкая газировка" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Сладкая газировка");
});

test("анатомия доступна с клавиатуры", async ({ page }) => {
  await go(page, "/body");
  const heart = page.locator('[data-organ="heart"]');
  await heart.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("organ-panel")).toContainText("Сердце");
  await expect(heart).toHaveAttribute("aria-pressed", "true");
  await page.getByTestId("body-pick-coffee").click();
  await page.getByTestId("organ-btn-bones").click();
  await expect(page.getByTestId("organ-panel")).toContainText("нет значимых связей");
});

test("новые продукты: энергетики, шоколад, лапша", async ({ page }) => {
  await go(page, "/products/energy-drinks");
  await expect(page.getByTestId("nutrient-value-caffeine")).toHaveText("30–32 мг");
  await page.locator('[data-organ="heart"]').click();
  await expect(page.getByTestId("organ-panel")).toContainText("Сердцебиение и давление");
  await go(page, "/products/chocolate");
  await expect(page.getByTestId("nutrient-value-satFat")).toHaveText("24,5 г");
  await go(page, "/products/instant-noodles");
  await expect(page.getByTestId("nutrient-value-salt")).toHaveText("2–4,9 г");
  await expect(page.getByTestId("nutrient-value-energy")).toHaveText("Данные уточняются");
  await page.getByTestId("organ-btn-vessels").click();
  await expect(page.getByTestId("organ-panel")).toContainText("Доказанная причинная связь");
  await go(page, "/prevention?product=instant-noodles");
  await expect(page.getByTestId("before-after").first()).toContainText("Данные уточняются");
});

test("отсутствующие данные показываются честно", async ({ page }) => {
  await go(page, "/products/chips");
  await expect(page.getByTestId("nutrient-value-fiber")).toHaveText("Данные уточняются");
  await go(page, "/prevention?product=chips");
  await expect(page.getByTestId("before-after").first()).toContainText("Данные уточняются");
});

test("прогресс сохраняется: план привычек, избранное, значки", async ({ page }) => {
  await go(page, "/prevention/habits");
  await page.getByTestId("goal-water").click();
  await page.getByTestId("habit-day-0").click();
  await page.getByTestId("habit-day-1").click();
  await expect(page.getByTestId("habit-progress")).toHaveText("2 / 7");
  await page.reload();
  await expect(page.getByTestId("habit-progress")).toHaveText("2 / 7");

  await go(page, "/products/coffee");
  await page.getByTestId("favorite-btn").click();
  await expect(page.getByTestId("favorite-btn")).toHaveAttribute("aria-pressed", "true");
  await go(page, "/favorites");
  await expect(page.getByTestId("fav-item")).toContainText("Кофе");
  await expect(page.getByTestId("badge-explorer")).toHaveAttribute("data-earned", "true");
});

test("переключение темы сохраняется", async ({ page }) => {
  await go(page, "/");
  const before = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  await page.getByTestId("theme-toggle").click();
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains("dark"))).toBe(!before);
  await page.reload();
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains("dark"))).toBe(!before);
});

test("мифы, сравнение, 404", async ({ page }) => {
  await go(page, "/myths");
  await page.getByTestId("myth-healthy-expensive-depends").click();
  await expect(page.locator("#healthy-expensive")).toContainText("Верно");
  await go(page, "/compare");
  await page.getByTestId("compare-b").selectOption("chips");
  await expect(page.getByTestId("compare-warning")).toBeVisible();
  await go(page, "/no-such-page");
  await expect(page.getByTestId("not-found")).toBeVisible();
  await go(page, "/products/unknown");
  await expect(page.getByTestId("not-found")).toBeVisible();
});

test("доступность: язык, skip-link, имена кнопок, подписи иллюстраций", async ({ page }) => {
  for (const r of ["/", "/products/soda", "/products/instant-noodles", "/products/energy-drinks", "/body", "/diseases/caries", "/quizzes/sugar", "/prevention?product=coffee"]) {
    await go(page, r);
    await page.waitForTimeout(300);
    const issues = await page.evaluate(() => {
      const out: string[] = [];
      if (document.documentElement.lang !== "ru") out.push("lang");
      if (!document.querySelector(".skip-link")) out.push("skip-link");
      document.querySelectorAll("button, a[href], [role=button]").forEach((el) => {
        const name = (el.getAttribute("aria-label") || el.textContent || "").trim();
        if (!name) out.push("без имени: " + el.outerHTML.slice(0, 80));
      });
      document.querySelectorAll('svg[role="img"]').forEach((s) => { if (!s.getAttribute("aria-label")) out.push("svg без подписи"); });
      if (document.querySelectorAll("h1").length !== 1) out.push("h1 count " + document.querySelectorAll("h1").length);
      return out;
    });
    expect(issues, r).toEqual([]);
  }
});

test("@mobile 320 px: меню и отсутствие горизонтальной прокрутки", async ({ page }) => {
  for (const r of ["/", "/products/soda", "/body", "/prevention?product=soda", "/quizzes/sugar", "/compare", "/diseases/hypertension"]) {
    await go(page, r);
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `горизонтальная прокрутка на ${r}`).toBeLessThanOrEqual(1);
  }
  await go(page, "/");
  await page.getByTestId("menu-toggle").click();
  await page.locator("#mobile-menu").getByRole("link", { name: "Заболевания" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Заболевания и состояния");
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
});
