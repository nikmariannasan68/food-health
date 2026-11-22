import { confidenceLabels, evidenceLabels, type Confidence, type DataStatus, type EvidenceType } from "@/content";
import { statusLabels } from "@/lib/format";
import { Icon } from "./Icon";

const evidenceTone: Record<EvidenceType, string> = {
  causal: "chip-blue",
  direct: "chip-blue",
  association: "chip-orange",
  "diet-pattern": "chip-green",
};

export function EvidenceBadge({ type, confidence }: { type: EvidenceType; confidence?: Confidence }) {
  const e = evidenceLabels[type];
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span className={`chip ${evidenceTone[type]}`} title={e.hint}>
        <Icon name="flask" size={13} />
        {e.label}
      </span>
      {confidence && (
        <span className="chip" title="Уровень уверенности в доказательствах">
          Уверенность: {confidenceLabels[confidence].toLowerCase()}
        </span>
      )}
    </span>
  );
}

const statusTone: Record<DataStatus, string> = { sourced: "chip-blue", approximate: "chip-orange", unknown: "chip" };

export function DataStatusBadge({ status }: { status: DataStatus }) {
  const s = statusLabels[status];
  return (
    <span className={`chip ${statusTone[status]}`} title={s.hint}>
      <Icon name={status === "sourced" ? "check" : status === "approximate" ? "info" : "clock"} size={13} />
      {s.label}
    </span>
  );
}

export function ReviewNotice({ reviewedAt, medicalReview }: { reviewedAt: string; medicalReview: "pending" | "done" }) {
  const [y, m, d] = reviewedAt.split("-");
  return (
    <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
      <span className="chip chip-blue"><Icon name="book" size={13} />Источники сверены {d}.{m}.{y}</span>
      {medicalReview === "pending" ? (
        <span className="chip chip-orange" title="Материал подготовлен по указанным источникам и ожидает рецензии медицинского редактора">
          <Icon name="clock" size={13} />Ожидает проверки медицинским редактором
        </span>
      ) : (
        <span className="chip chip-green"><Icon name="check" size={13} />Проверено медицинским редактором</span>
      )}
    </p>
  );
}
