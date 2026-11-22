import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/Pages";

export const metadata: Metadata = { title: "О проекте", description: "Food & Health — образовательная платформа о питании и профилактике.", alternates: { canonical: "/about" } };

export default function Page() {
  return <AboutPage />;
}
