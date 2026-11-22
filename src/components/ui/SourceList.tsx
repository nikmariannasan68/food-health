import { getSources } from "@/content";
import { fmtDate } from "@/lib/format";
import { Icon } from "./Icon";

const kindLabel = {
  guideline: "Рекомендация",
  factsheet: "Информационный бюллетень",
  "systematic-review": "Систематический обзор",
  review: "Обзор литературы",
  study: "Исследование",
  "scientific-opinion": "Научное заключение",
  "consumer-info": "Материал для населения",
  database: "База данных",
} as const;

export function SourceList({ ids, title = "Научные источники", id }: { ids: string[]; title?: string; id?: string }) {
  const list = getSources(ids);
  if (!list.length) return null;
  return (
    <section aria-labelledby={id ? `${id}-title` : undefined} id={id}>
      <h2 id={id ? `${id}-title` : undefined} className="mb-4 text-xl font-bold">{title}</h2>
      <ol className="grid gap-3">
        {list.map((s) => (
          <li key={s.id} className="card p-4">
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-start gap-2 font-semibold text-sci hover:underline">
              <span>{s.title}</span>
              <Icon name="external" size={15} className="mt-1 shrink-0 opacity-70" />
              <span className="sr-only">(откроется в новой вкладке)</span>
            </a>
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
              <span>{s.org}</span>
              <span>·</span>
              <span>{kindLabel[s.kind]}</span>
              {s.date && (<><span>·</span><span>{s.dateLabel === "updated" ? "Обновлено" : "Опубликовано"}: {fmtDate(s.date)}</span></>)}
              <span>·</span>
              <span>Сверено: {fmtDate(s.accessed)}</span>
            </div>
            {s.note && <p className="mt-2 text-sm">{s.note}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Компактные ссылки-сноски под утверждением. */
export function SourceRefs({ ids }: { ids: string[] }) {
  const list = getSources(ids);
  if (!list.length) return null;
  return (
    <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
      <Icon name="book" size={13} />
      <span>Источник{list.length > 1 ? "и" : ""}:</span>
      {list.map((s, i) => (
        <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-sci">
          {s.org}{s.date ? `, ${s.date.slice(0, 4)}` : ""}{i < list.length - 1 ? ";" : ""}
        </a>
      ))}
    </p>
  );
}
