import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/features/products/types/product.types";
import { Button } from "@/components/common/Button";
import { useAppDispatch } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function ProductCard({ product, view = "grid" }: { product: Product; view?: "grid" | "list" }) {
  const dispatch = useAppDispatch();
  const variant = product.variants.find(item => item.stock > 0) ?? product.variants[0];
  const image = product.images[0]?.url ?? "";
  const add = () => dispatch(addItem({ id: `${product.id}-${variant.id}`, name: product.name, size: `${variant.size} ml`, price: variant.price, quantity: 1, image }));

  return (
    <article className={view === "list" ? "grid grid-cols-[112px_1fr] gap-4 border-b border-ink/10 py-5 sm:grid-cols-[180px_1fr] sm:gap-7" : "group"}>
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-[#eee8df]">
        <img src={image} alt={product.images[0]?.alt ?? product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        {(product.isNew || product.isBestseller || product.isDiscoverySet) && <span className="absolute left-3 top-3 bg-ivory px-2 py-1 text-[9px] font-semibold uppercase tracking-wider">{product.isDiscoverySet ? "Discovery set" : product.isNew ? "New" : "Bestseller"}</span>}
        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90" aria-hidden="true"><Heart size={16}/></span>
      </Link>
      <div className={view === "grid" ? "pt-4" : "flex flex-col justify-center"}>
        <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{product.brand}</p>
        <Link to={`/product/${product.slug}`} className="mt-1 block font-display text-xl hover:text-gold sm:text-2xl">{product.name}</Link>
        <p className="mt-1 text-xs text-muted">{product.concentration} · {product.gender}</p>
        <div className="mt-2 flex items-center gap-1 text-xs"><Star size={13} className="fill-gold text-gold"/><span>{product.rating.toFixed(1)}</span><span className="text-muted">({product.reviewCount} reviews)</span></div>
        <p className="mt-3 text-sm font-semibold">From {money.format(Math.min(...product.variants.map(item => item.price)))}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">{product.scentFamily.slice(0, 2).map(family => <span key={family} className="border border-ink/10 px-2 py-1 text-[9px] uppercase tracking-wider text-muted">{family}</span>)}</div>
        {view === "list" && <p className="mt-3 max-w-xl text-sm leading-6 text-muted">{product.shortDescription}</p>}
        <Button className="mt-4 w-full sm:w-auto" onClick={add} disabled={!variant || variant.stock < 1}>{variant?.stock ? "Quick add" : "Out of stock"}</Button>
      </div>
    </article>
  );
}
