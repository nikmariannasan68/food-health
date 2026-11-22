import type { Metadata } from "next";
import { PreventionPage } from "@/components/pages/Pages";

export const metadata: Metadata = { title: "Профилактика", description: "Что можно сделать, чтобы снизить риски: альтернативы, сравнение «Было / Стало», рекомендации.", alternates: { canonical: "/prevention" } };

export default function Page() {
  return <PreventionPage />;
}
