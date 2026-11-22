import type { Metadata } from "next";
import { HabitsPage } from "@/components/pages/Pages";

export const metadata: Metadata = { title: "План привычек на 7 дней", description: "Выберите одну реалистичную цель и отмечайте выполнение 7 дней.", alternates: { canonical: "/prevention/habits" } };

export default function Page() {
  return <HabitsPage />;
}
