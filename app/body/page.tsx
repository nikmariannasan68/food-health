import type { Metadata } from "next";
import { BodyPage } from "@/components/pages/Pages";

export const metadata: Metadata = { title: "Организм человека", description: "Интерактивная модель тела: связи продуктов с органами и системами.", alternates: { canonical: "/body" } };

export default function Page() {
  return <BodyPage />;
}
