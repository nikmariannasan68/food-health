import type { Metadata } from "next";
import { MythsPage } from "@/components/pages/Pages";

export const metadata: Metadata = { title: "Миф или факт", description: "Интерактивные карточки: распространённые утверждения о еде и научные объяснения.", alternates: { canonical: "/myths" } };

export default function Page() {
  return <MythsPage />;
}
