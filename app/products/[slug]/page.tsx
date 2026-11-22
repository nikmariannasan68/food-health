import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/content";
import { ProductView } from "@/components/product/ProductView";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.summary,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { title: `${p.name} — влияние на организм и профилактика`, description: p.summary, type: "article" },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return <ProductView product={product} />;
}
