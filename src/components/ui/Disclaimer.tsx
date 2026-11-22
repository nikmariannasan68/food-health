import { Icon } from "./Icon";

export const DISCLAIMER_TEXT =
  "Информация на сайте предназначена для образовательных целей и не заменяет консультацию квалифицированного медицинского специалиста.";

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <aside className={`card flex gap-3 border-l-4 p-4 text-sm ${className}`} style={{ borderLeftColor: "var(--blue)" }} aria-label="Медицинский дисклеймер">
      <Icon name="info" className="mt-0.5 shrink-0 text-sci" />
      <p className="text-muted">{DISCLAIMER_TEXT}</p>
    </aside>
  );
}
