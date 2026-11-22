"use client";
import { useState } from "react";
import { updateState, useAppState } from "@/lib/storage";
import { plural } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";

export const GOALS = [
  { id: "water", text: "Заменять один сладкий напиток в день водой", icon: "drop" },
  { id: "veg", text: "Добавлять порцию овощей к одному приёму пищи", icon: "leaf" },
  { id: "snack", text: "Отсыпать солёные снэки в тарелку, а не есть из пачки", icon: "salt" },
  { id: "coffee", text: "Последняя чашка кофе — до 14:00", icon: "coffee" },
  { id: "walk", text: "Гулять 20 минут в день", icon: "activity" },
  { id: "teeth", text: "Чистить зубы пастой с фтором утром и вечером", icon: "tooth" },
];

const DAY_NAMES = ["День 1", "День 2", "День 3", "День 4", "День 5", "День 6", "День 7"];

function encouragement(done: number) {
  if (done === 0) return "Начните, когда будете готовы. Один день — уже шаг.";
  if (done < 3) return "Хорошее начало! Каждая отметка — маленькая победа.";
  if (done < 7) return "Здорово получается. Пропущенный день — это нормально: просто продолжайте.";
  return "Вы прошли все 7 дней! Можно закрепить эту привычку или выбрать новую.";
}

export function HabitPlanner() {
  const { habit } = useAppState();
  const [custom, setCustom] = useState("");

  function start(goalId: string, goalText: string) {
    updateState((s) => ({ ...s, habit: { goalId, goalText, startedAt: new Date().toISOString(), days: Array(7).fill(false) } }));
  }
  function toggleDay(i: number) {
    updateState((s) => (s.habit ? { ...s, habit: { ...s.habit, days: s.habit.days.map((d, j) => (j === i ? !d : d)) } } : s));
  }
  function reset() {
    updateState((s) => ({ ...s, habit: null }));
  }

  if (!habit) {
    return (
      <div data-testid="habit-choose">
        <h2 className="mb-4 text-2xl font-extrabold">Выберите одну цель</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GOALS.map((g) => (
            <button key={g.id} type="button" onClick={() => start(g.id, g.text)} className="card card-hover flex items-start gap-3 p-5 text-left" data-testid={`goal-${g.id}`}>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-good-soft text-good"><Icon name={g.icon} /></span>
              <span className="font-semibold">{g.text}</span>
            </button>
          ))}
        </div>
        <form
          className="card mt-5 flex flex-col gap-3 p-5 sm:flex-row sm:items-end"
          onSubmit={(e) => { e.preventDefault(); if (custom.trim()) start("custom", custom.trim()); }}
        >
          <div className="flex-1">
            <label htmlFor="custom-goal" className="mb-1.5 block text-sm font-semibold">Или своя цель</label>
            <input id="custom-goal" className="input !pl-4" maxLength={120} value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Например: брать бутылку воды на учёбу" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={!custom.trim()}>Начать</button>
        </form>
        <p className="mt-3 text-xs text-muted">Прогресс хранится только в вашем браузере. Мы не отправляем никаких уведомлений.</p>
      </div>
    );
  }

  const done = habit.days.filter(Boolean).length;
  const pct = Math.round((done / 7) * 100);

  return (
    <div data-testid="habit-active">
      <div className="card p-6 sm:p-8">
        <p className="eyebrow">Ваша цель на 7 дней</p>
        <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">{habit.goalText}</h2>
        <div className="mt-6 flex items-center gap-4">
          <div className="meter h-3 flex-1" role="progressbar" aria-valuemin={0} aria-valuemax={7} aria-valuenow={done} aria-label="Прогресс плана">
            <span style={{ width: `${pct}%`, background: "var(--green)" }} />
          </div>
          <span className="font-display text-lg font-extrabold tabular-nums" data-testid="habit-progress">{done} / 7</span>
        </div>
        <p className="mt-3 text-muted" aria-live="polite">{encouragement(done)}</p>

        <ol className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {habit.days.map((d, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggleDay(i)}
                aria-pressed={d}
                className={`flex h-24 w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 font-semibold transition-all ${d ? "border-good bg-good-soft text-good" : "border-dashed border-line hover:border-good"}`}
                data-testid={`habit-day-${i}`}
              >
                <span className={`grid h-9 w-9 place-items-center rounded-full ${d ? "bg-good text-white dark:text-[#06210f]" : "bg-surface-2"}`}>
                  {d ? <Icon name="check" size={18} /> : <span className="text-sm">{i + 1}</span>}
                </span>
                <span className="text-sm">{DAY_NAMES[i]}</span>
                <span className="sr-only">{d ? "выполнено" : "не отмечено"}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-secondary" onClick={reset}><Icon name="refresh" size={18} />Выбрать другую цель</button>
          <span className="text-sm text-muted">Отмечено {done} {plural(done, "день", "дня", "дней")}.</span>
        </div>
      </div>
    </div>
  );
}
