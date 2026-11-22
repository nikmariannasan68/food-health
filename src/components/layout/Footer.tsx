import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { DISCLAIMER_TEXT } from "@/components/ui/Disclaimer";
import { MotionToggle } from "./ThemeToggle";

const COLS = [
  { title: "Изучать", links: [["/products", "Продукты"], ["/body", "Организм человека"], ["/diseases", "Заболевания"], ["/compare", "Сравнение продуктов"]] },
  { title: "Действовать", links: [["/prevention", "Профилактика"], ["/prevention/habits", "План на 7 дней"], ["/quizzes", "Тесты"], ["/myths", "Мифы и факты"]] },
  { title: "О проекте", links: [["/about", "О проекте"], ["/sources", "Источники и редполитика"], ["/favorites", "Избранное и прогресс"], ["/privacy", "Конфиденциальность"]] },
] as const;

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <p className="flex items-center gap-2 font-display text-lg font-extrabold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-good text-white dark:text-[#06210f]"><Icon name="leaf" size={18} /></span>
            Food &amp; Health
          </p>
          <p className="mt-3 font-semibold text-good">«Твой выбор сегодня — твоё здоровье завтра»</p>
          <p className="mt-3 text-sm text-muted">{DISCLAIMER_TEXT}</p>
          <div className="mt-4"><MotionToggle /></div>
        </div>
        {COLS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">{c.title}</h2>
            <ul className="grid gap-2">
              {c.links.map(([href, label]) => (
                <li key={href}><Link href={href} className="text-sm hover:text-good">{label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} Food &amp; Health · Образовательный проект · Данные основаны на ВОЗ, EFSA, CDC, FDA и систематических обзорах
      </div>
    </footer>
  );
}
