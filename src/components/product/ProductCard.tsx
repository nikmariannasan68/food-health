import Link from "next/link";
import { categoryLabels, type Product } from "@/content";
import { Icon } from "@/components/ui/Icon";
import { ProductArt } from "./ProductArt";

const artBg: Record<string, string> = {
  soda: "from-rose-100 to-orange-50 dark:from-rose-950/50 dark:to-orange-950/30",
  chips: "from-amber-100 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/30",
  coffee: "from-stone-200 to-amber-50 dark:from-stone-800/60 dark:to-amber-950/30",
  energy: "from-sky-100 to-lime-50 dark:from-sky-950/50 dark:to-lime-950/30",
  chocolate: "from-orange-100 to-stone-100 dark:from-orange-950/40 dark:to-stone-900/40",
  noodles: "from-red-100 to-amber-50 dark:from-red-950/40 dark:to-amber-950/30",
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <article className="card card-hover group relative flex flex-col overflow-hidden animate-fade-up" style={{ animationDelay: `${index * 70}ms` }} data-testid="product-card">
      <div className={`relative grid h-48 place-items-center bg-gradient-to-br ${artBg[product.art] ?? "from-surface-2 to-surface"}`}>
        <ProductArt art={product.art} className="h-40 w-40 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2" title={product.imageAlt} />
        <span className="chip absolute left-3 top-3 bg-surface/90">{categoryLabels[product.categories[0]]}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-extrabold">{product.name}</h3>
        <p className="mt-1.5 flex-1 text-muted">{product.summary}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.typicalFeatures.slice(0, 2).map((f) => <span key={f} className="chip">{f}</span>)}
        </div>
        <Link href={`/products/${product.slug}`} className="btn btn-secondary mt-4 self-start after:absolute after:inset-0 after:content-['']" aria-label={`Узнать больше: ${product.name}`}>
          Узнать больше <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
