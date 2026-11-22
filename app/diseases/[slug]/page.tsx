import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { diseases, getDisease } from "@/content";
import { DiseaseView } from "@/components/disease/DiseaseView";

export const dynamicParams = false;

export function generateStaticParams() {
  return diseases.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getDisease(slug);
  if (!d) return {};
  return { title: d.name, description: d.short, alternates: { canonical: `/diseases/${d.slug}` }, openGraph: { title: d.name, description: d.short, type: "article" } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const disease = getDisease(slug);
  if (!disease) notFound();
  return <DiseaseView disease={disease} />;
}
