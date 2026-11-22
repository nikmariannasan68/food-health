"use client";
/**
 * Локальное хранилище прогресса. Без аккаунта, без отправки на сервер.
 * Храним только учебный прогресс: избранное, просмотры, результаты тестов, план привычек.
 * Никаких медицинских персональных данных.
 */
import { useCallback, useSyncExternalStore } from "react";

export interface HabitState {
  goalId: string;
  goalText: string;
  startedAt: string;
  days: boolean[];
}

export interface QuizRecord {
  best: number;
  last: number;
  attempts: number;
  at: string;
}

export interface AppState {
  v: 1;
  favorites: string[]; // "product:soda", "disease:caries"
  viewed: string[]; // те же ключи
  quizzes: Record<string, QuizRecord>;
  habit: HabitState | null;
  myths: Record<string, "myth" | "fact" | "depends">;
}

const KEY = "food-health:v1";
const EMPTY: AppState = { v: 1, favorites: [], viewed: [], quizzes: {}, habit: null, myths: {} };

let cache: AppState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function read(): AppState {
  if (loaded) return cache;
  loaded = true;
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.v === 1) cache = { ...EMPTY, ...parsed };
    }
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: AppState) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* приватный режим или переполнение — работаем в памяти */
  }
  listeners.forEach((l) => l());
}

export function updateState(fn: (s: AppState) => AppState) {
  write(fn(read()));
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      loaded = false;
      read();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function useFavorite(key: string) {
  const state = useAppState();
  const active = state.favorites.includes(key);
  const toggle = useCallback(() => {
    updateState((s) => ({
      ...s,
      favorites: s.favorites.includes(key) ? s.favorites.filter((k) => k !== key) : [...s.favorites, key],
    }));
  }, [key]);
  return { active, toggle };
}

export function markViewed(key: string) {
  const s = read();
  if (s.viewed.includes(key)) return;
  write({ ...s, viewed: [...s.viewed, key] });
}

export function saveQuizResult(slug: string, percent: number) {
  updateState((s) => {
    const prev = s.quizzes[slug];
    return {
      ...s,
      quizzes: {
        ...s.quizzes,
        [slug]: { best: Math.max(prev?.best ?? 0, percent), last: percent, attempts: (prev?.attempts ?? 0) + 1, at: new Date().toISOString() },
      },
    };
  });
}

export function resetAll() {
  write(EMPTY);
}

export interface Achievement {
  id: string;
  title: string;
  text: string;
  earned: boolean;
  icon: string;
}

export function achievements(s: AppState): Achievement[] {
  const viewedProducts = s.viewed.filter((k) => k.startsWith("product:")).length;
  const viewedDiseases = s.viewed.filter((k) => k.startsWith("disease:")).length;
  const quizzesDone = Object.keys(s.quizzes).length;
  const perfect = Object.values(s.quizzes).some((q) => q.best === 100);
  const habitDays = s.habit?.days.filter(Boolean).length ?? 0;
  const mythsAnswered = Object.keys(s.myths).length;
  return [
    { id: "explorer", title: "Исследователь", text: "Изучить первый продукт", earned: viewedProducts >= 1, icon: "search" },
    { id: "curious", title: "Любознательный", text: "Изучить 3 продукта", earned: viewedProducts >= 3, icon: "sparkles" },
    { id: "anatomist", title: "Анатом", text: "Прочитать 2 материала о заболеваниях", earned: viewedDiseases >= 2, icon: "heart" },
    { id: "quiz", title: "Первый тест", text: "Пройти любой тест", earned: quizzesDone >= 1, icon: "check" },
    { id: "perfect", title: "Без ошибок", text: "Пройти тест на 100%", earned: perfect, icon: "star" },
    { id: "myth", title: "Разрушитель мифов", text: "Ответить на 5 карточек «Миф или факт»", earned: mythsAnswered >= 5, icon: "bulb" },
    { id: "habit", title: "Шаг за шагом", text: "Отметить 3 дня в плане привычек", earned: habitDays >= 3, icon: "leaf" },
  ];
}
