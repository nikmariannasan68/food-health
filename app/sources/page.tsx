import type { Metadata } from "next";
import { SourcesPage } from "@/components/pages/Pages";

export const metadata: Metadata = { title: "Источники и редакционная политика", description: "Научные источники и принципы работы с медицинским контентом.", alternates: { canonical: "/sources" } };

export default function Page() {
  return <SourcesPage />;
}
