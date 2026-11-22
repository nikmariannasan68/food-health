import { defineConfig, devices } from "@playwright/test";

/**
 * Два режима:
 *  - по умолчанию — против Next.js (`npm run build && npm run start`, порт 3000);
 *  - PREVIEW=1 — против превью-сборки preview/dist/index.html (без сервера).
 */
const preview = !!process.env.PREVIEW;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: preview ? undefined : process.env.BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] }, grepInvert: /@mobile/ },
    { name: "mobile-320", use: { ...devices["Desktop Chrome"], viewport: { width: 320, height: 700 }, hasTouch: true }, grep: /@mobile/ },
  ],
  webServer: preview || process.env.BASE_URL ? undefined : { command: "npm run start", port: 3000, reuseExistingServer: true, timeout: 120_000 },
});
