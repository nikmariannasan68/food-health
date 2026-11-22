import type { Metadata } from "next";
import { DiseasesPage } from "@/components/pages/Pages";

export const metadata: Metadata = { title: "Заболевания", description: "Каталог заболеваний и состояний, на риск которых может влиять питание.", alternates: { canonical: "/diseases" } };

export default function Page() {
  return <DiseasesPage />;
}
