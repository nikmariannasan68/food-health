import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, lead, children }: { eyebrow?: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <section className="gradient-hero border-b border-line">
      <div className="container-page py-12 md:py-16">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl text-4xl font-extrabold sm:text-5xl">{title}</h1>
        {lead && <p className="lead mt-4 max-w-2xl">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
