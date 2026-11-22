import type { Metadata } from "next";
import { ComparePage } from "@/components/pages/Pages";

export const metadata: Metadata = { title: "Сравнение продуктов", description: "Сравните состав двух продуктов.", alternates: { canonical: "/compare" } };

export default function Page() {
  return <ComparePage />;
}
