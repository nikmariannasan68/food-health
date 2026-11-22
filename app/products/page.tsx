import type { Metadata } from "next";
import { ProductsPage } from "@/components/pages/Pages";

export const metadata: Metadata = { title: "Продукты", description: "Каталог продуктов: состав, влияние на организм, риски и профилактика.", alternates: { canonical: "/products" } };

export default function Page() {
  return <ProductsPage />;
}
