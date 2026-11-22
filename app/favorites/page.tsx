import type { Metadata } from "next";
import { FavoritesPage } from "@/components/pages/Pages";

export const metadata: Metadata = { title: "Избранное и прогресс", description: "Избранные материалы, история и значки.", alternates: { canonical: "/favorites" }, robots: { index: false } };

export default function Page() {
  return <FavoritesPage />;
}
