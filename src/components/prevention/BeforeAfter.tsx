import type { BeforeAfter as BA } from "@/content";
import { amountMax, fmtAmount } from "@/lib/format";
import { DataStatusBadge } from "@/components/ui/Badges";
import { SourceRefs } from "@/components/ui/SourceList";
import { Icon } from "@/components/ui/Icon";

export function BeforeAfter({ data }: { data: BA }) {
  return (
    <div className="card overflow-hidden" data-testid="before-after">
      <div className="grid grid-cols-2">
        <div className="bg-warn-soft p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-warn">Было</p>
          <p className="mt-1 text-lg font-extrabold">{data.before}</p>
        </div>
        <div className="bg-good-soft p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-good">Стало</p>
          <p className="mt-1 text-lg font-extrabold">{data.after}</p>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="chip"><Icon name="scale" size={13} />Порция: {data.portion}</span>
          <DataStatusBadge status={data.status} />
        </div>
        <table className="w-full text-sm">
          <caption className="sr-only">Сравнение {data.before} и {data.after} на порцию {data.portion}</caption>
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted">
              <th scope="col" className="pb-2 font-bold">Показатель</th>
              <th scope="col" className="pb-2 font-bold">Было</th>
              <th scope="col" className="pb-2 font-bold">Стало</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => {
              const b = amountMax(r.before), a = amountMax(r.after);
              const scale = Math.max(b ?? 0, a ?? 0, 0.0001);
              return (
                <tr key={r.label} className="border-t border-line align-top">
                  <th scope="row" className="py-3 pr-2 text-left font-semibold">{r.label}</th>
                  <td className="py-3 pr-2">
                    <span className="block font-bold tabular-nums">{fmtAmount(r.before, r.unit)}</span>
                    {b !== null && <span className="meter mt-1.5 block w-full max-w-[9rem]" aria-hidden><span style={{ width: `${(b / scale) * 100}%`, background: "var(--orange)" }} /></span>}
                  </td>
                  <td className="py-3">
                    <span className={`block font-bold tabular-nums ${r.after.kind === "unknown" ? "text-muted" : ""}`}>{fmtAmount(r.after, r.unit)}</span>
                    {a !== null && <span className="meter mt-1.5 block w-full max-w-[9rem]" aria-hidden><span style={{ width: `${Math.max(2, (a / scale) * 100)}%`, background: "var(--green)" }} /></span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {data.note && <p className="mt-3 text-xs text-muted">{data.note}</p>}
        <SourceRefs ids={data.sourceIds} />
      </div>
    </div>
  );
}
