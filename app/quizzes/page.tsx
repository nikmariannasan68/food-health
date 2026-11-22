import type { Metadata } from "next";
import { QuizzesPage } from "@/components/pages/Pages";

export const metadata: Metadata = { title: "Тесты", description: "Интерактивные тесты о сахаре, соли, кофеине, этикетках и профилактике.", alternates: { canonical: "/quizzes" } };

export default function Page() {
  return <QuizzesPage />;
}
