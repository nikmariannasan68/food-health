import type { Amount, DataStatus } from "@/content";

const nf = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });

export function fmtNumber(n: number): string {
  return nf.format(n);
}

/** «9–11 г», «90 мг», «Данные уточняются». */
export function fmtAmount(a: Amount | undefined, unit: string): string {
  if (!a || a.kind === "unknown") return "Данные уточняются";
  if (a.kind === "exact") return `${fmtNumber(a.value)} ${unit}`;
  if (a.min === a.max) return `${fmtNumber(a.min)} ${unit}`;
  return `${fmtNumber(a.min)}–${fmtNumber(a.max)} ${unit}`;
}

/** Значение для шкалы: середина диапазона, null — если неизвестно. */
export function amountMid(a: Amount | undefined): number | null {
  if (!a || a.kind === "unknown") return null;
  if (a.kind === "exact") return a.value;
  return (a.min + a.max) / 2;
}

export function amountMax(a: Amount | undefined): number | null {
  if (!a || a.kind === "unknown") return null;
  return a.kind === "exact" ? a.value : a.max;
}

export const statusLabels: Record<DataStatus, { label: string; hint: string }> = {
  sourced: { label: "По источнику", hint: "Значение взято из указанного источника" },
  approximate: { label: "Ориентировочно", hint: "Типичный диапазон; у конкретного продукта смотрите этикетку" },
  unknown: { label: "Данные уточняются", hint: "Проверенных данных пока нет — мы не показываем выдуманные числа" },
};

export function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  const monthsNom = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
  if (!m) return String(y);
  if (!d) return `${monthsNom[m - 1]} ${y}`;
  return `${d} ${months[m - 1]} ${y}`;
}

export function plural(n: number, one: string, few: string, many: string): string {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
