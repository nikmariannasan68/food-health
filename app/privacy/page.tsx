import type { Metadata } from "next";
import { PrivacyPage } from "@/components/pages/Pages";

export const metadata: Metadata = { title: "Политика конфиденциальности", description: "Какие данные хранятся и как их удалить.", alternates: { canonical: "/privacy" } };

export default function Page() {
  return <PrivacyPage />;
}
