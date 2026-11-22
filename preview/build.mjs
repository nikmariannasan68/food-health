/**
 * Превью-сборка: тот же код компонентов → один самодостаточный HTML-файл (hash-маршруты).
 * Используется для автотестов в браузере и для демонстрации без сервера.
 * Продакшен-сборка — `npm run build` (Next.js).
 *
 *   node preview/build.mjs  →  preview/dist/index.html
 */
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "preview/dist");
fs.mkdirSync(out, { recursive: true });

const nodePaths = [path.join(root, "node_modules"), ...(process.env.EXTRA_NODE_PATH ?? "").split(":").filter(Boolean)];
const require = createRequire(path.join(root, "package.json"));
function resolvePkg(name) {
  for (const p of nodePaths) {
    const f = path.join(p, name);
    if (fs.existsSync(f)) return f;
  }
  return path.dirname(require.resolve(name + "/package.json"));
}

// 1. JS
const js = await build({
  entryPoints: [path.join(root, "preview/entry.tsx")],
  bundle: true,
  write: false,
  format: "esm",
  minify: true,
  target: "es2020",
  jsx: "automatic",
  nodePaths,
  alias: {
    "@": path.join(root, "src"),
    "next/link": path.join(root, "preview/shims/next-link.tsx"),
    "next/navigation": path.join(root, "preview/shims/next-navigation.ts"),
  },
  define: { "process.env.NODE_ENV": '"production"', "process.env.NEXT_PUBLIC_SITE_URL": '"https://example.org"' },
  logLevel: "warning",
});
const jsCode = js.outputFiles[0].text;

// 2. CSS (Tailwind v4 через JS API: собираем классы-кандидаты из исходников)
const twDir = resolvePkg("tailwindcss");
const { compile } = await import(pathToFileURL(path.join(twDir, "dist/lib.mjs")).href);
const cssSrc = fs.readFileSync(path.join(root, "app/globals.css"), "utf8");
const compiler = await compile(cssSrc, {
  base: root,
  loadStylesheet: async (id) => {
    const file = id === "tailwindcss" ? path.join(twDir, "index.css") : path.join(twDir, id.replace(/^tailwindcss\//, ""));
    return { path: file, base: path.dirname(file), content: fs.readFileSync(file, "utf8") };
  },
});
const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) { if (!["node_modules", "dist"].includes(f.name)) walk(p); }
    else if (/\.(tsx?|mdx?)$/.test(f.name)) files.push(p);
  }
})(path.join(root, "src"));
files.push(path.join(root, "preview/entry.tsx"));
const candidates = new Set();
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  for (const t of src.split(/[\s"`{}<>]+/)) if (t && t.length < 140) { candidates.add(t); candidates.add(t.replace(/^'+|'+$/g, "")); }
  for (const m of src.matchAll(/[!a-z0-9:_-]*\[[^\]\s"]*\][a-z0-9-]*/gi)) candidates.add(m[0]);
}
const css = compiler.build([...candidates]);

// 3. HTML
const themeScript = `(function(){try{var t=localStorage.getItem('food-health:theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');if(localStorage.getItem('food-health:reduce-motion')==='1')document.documentElement.classList.add('reduce-motion');}catch(e){}})();`;
const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Food &amp; Health — Узнай, что ты ешь</title>
<meta name="description" content="Интерактивная образовательная платформа о влиянии продуктов на организм и профилактике заболеваний." />
<script>${themeScript}</script>
<style>${css}</style>
</head>
<body class="min-h-screen">
<div id="root"></div>
<noscript>Для работы интерактивной платформы включите JavaScript.</noscript>
<script type="module">${jsCode.replace(/<\/script/g, "<\\/script")}</script>
</body>
</html>`;
fs.writeFileSync(path.join(out, "index.html"), html);
console.log(`preview/dist/index.html — ${(html.length / 1024).toFixed(0)} КБ (JS ${(jsCode.length / 1024).toFixed(0)} КБ, CSS ${(css.length / 1024).toFixed(0)} КБ)`);
