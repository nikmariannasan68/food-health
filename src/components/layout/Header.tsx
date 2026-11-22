"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { SearchDialog } from "./SearchDialog";
import { ThemeToggle } from "./ThemeToggle";

export const NAV = [
  { href: "/", label: "Главная" },
  { href: "/products", label: "Продукты" },
  { href: "/body", label: "Организм человека" },
  { href: "/diseases", label: "Заболевания" },
  { href: "/prevention", label: "Профилактика" },
  { href: "/quizzes", label: "Тесты" },
  { href: "/about", label: "О проекте" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

export function Header() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_oklab,var(--bg)_82%,transparent)] backdrop-blur-xl">
      <div className="container-page flex h-16 items-center gap-3 2xl:max-w-[1360px]">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-extrabold tracking-tight" aria-label="Food & Health — на главную">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-good text-white shadow-soft dark:text-[#06210f]">
            <Icon name="leaf" size={20} />
          </span>
          <span className="font-display text-lg max-[359px]:sr-only">Food <span className="text-good">&</span> Health</span>
        </Link>

        <nav aria-label="Основная навигация" className="ml-2 hidden xl:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={isActive(pathname, n.href) ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-semibold transition-colors ${isActive(pathname, n.href) ? "bg-surface-2 text-ink" : "text-muted hover:text-ink"}`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
          <button type="button" onClick={() => setSearchOpen(true)} className="btn btn-ghost btn-icon sm:w-auto sm:px-3 xl:w-11 xl:px-2 2xl:w-auto 2xl:px-3" aria-label="Поиск по сайту" data-testid="search-open">
            <Icon name="search" />
            <span className="hidden text-sm font-medium text-muted sm:inline xl:hidden 2xl:inline">Поиск</span>
            <kbd className="hidden rounded-md border border-line px-1.5 text-xs text-muted lg:inline xl:hidden 2xl:inline">Ctrl K</kbd>
          </button>
          <ThemeToggle />
          <Link href="/products" className="btn btn-primary hidden md:inline-flex xl:hidden 2xl:inline-flex">
            Начать исследование
          </Link>
          <button
            type="button"
            className="btn btn-ghost btn-icon xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((v) => !v)}
            data-testid="menu-toggle"
          >
            <Icon name={open ? "x" : "menu"} />
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Мобильная навигация" className="animate-pop border-t border-line bg-surface xl:hidden">
          <ul className="container-page grid gap-1 py-3">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={isActive(pathname, n.href) ? "page" : undefined}
                  className={`flex min-h-12 items-center justify-between rounded-xl px-4 font-semibold ${isActive(pathname, n.href) ? "bg-good-soft text-good" : "hover:bg-surface-2"}`}
                >
                  {n.label}
                  <Icon name="chevron-right" size={18} className="opacity-50" />
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/products" className="btn btn-primary w-full">Начать исследование</Link>
            </li>
          </ul>
        </nav>
      )}

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
