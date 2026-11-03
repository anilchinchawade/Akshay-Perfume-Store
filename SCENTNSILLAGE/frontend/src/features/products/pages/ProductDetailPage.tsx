import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Check, ShieldCheck, Star, Heart } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { FragrancePyramid } from "@/features/products/components/FragrancePyramid";
import { ProductCard } from "@/features/products/components/ProductCard";
import { productService } from "@/features/products/services/productService";
import { useAppDispatch } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { useAppSelector } from "@/store/hooks";
import { products as catalogue } from "@/features/products/data/products";
import { ReviewForm } from "@/features/reviews/components/ReviewForm";
import { reviewService } from "@/features/reviews/services/reviewService";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const RECENT_KEY = "scentnsillage-recent-products";

export function ProductDetailPage() {
  const { slug = "" } = useParams();
  const dispatch = useAppDispatch();
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const { data: product, isLoading, isError } = useQuery({ queryKey: ["product", slug], queryFn: () => productService.getProductBySlug(slug) });
  const isSaved = useAppSelector(state => state.wishlist.items.some(item => item.productId === product?.id));
  const { data: related = [] } = useQuery({ queryKey: ["similar-products", product?.id], queryFn: () => product ? productService.getSimilarProducts(product) : Promise.resolve([]), enabled: Boolean(product) });
  const { data: reviewData } = useQuery({ queryKey:["product-reviews",slug], queryFn:()=>reviewService.forProduct(slug), enabled:Boolean(product) });

  useEffect(() => {
    if (!product) return;
    const previous: string[] = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    const next = [product.slug, ...previous.filter(item => item !== product.slug)].slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    setRecentSlugs(next.filter(item => item !== product.slug));
  }, [product]);
  useEffect(() => {
    if (product && !product.variants.some(variant => variant.id === selectedVariantId)) {
      const available = product.variants.find(variant => variant.stock > 0) ?? product.variants[0];
      setSelectedVariantId(available?.id ?? "");
    }
  }, [product, selectedVariantId]);

  if (isLoading) return <Container><div className="grid animate-pulse gap-10 py-16 md:grid-cols-2"><div className="aspect-[4/5] bg-beige"/><div className="space-y-5"><div className="h-8 w-2/3 bg-beige"/><div className="h-4 w-1/2 bg-beige"/><div className="h-20 bg-beige"/></div></div></Container>;
  if (isError || !product) return <Container><div className="py-24 text-center"><h1 className="font-display text-3xl">Fragrance not found</h1><Link to="/shop" className="mt-5 inline-block underline">Return to the collection</Link></div></Container>;

  const variant = product.variants.find(item => item.id === selectedVariantId) ?? product.variants[0];
  const image = product.images[selectedImage]?.url ?? product.images[0]?.url ?? "";
  const inStock = variant.stock > 0;
  const handleAdd = () => dispatch(addItem({ id: `${product.id}-${variant.id}`, productId: product.id, slug: product.slug, name: product.name, size: `${variant.size} ml`, price: variant.price, quantity: 1, image, stock: variant.stock }));
  const handleWishlist = () => dispatch(toggleWishlist({ productId: product.id, slug: product.slug, name: product.name, brand: product.brand, price: variant.price, image }));

  return <Container>
    <div className="py-7 text-xs text-muted"><Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span className="text-ink">{product.name}</span></div>
    <section className="grid gap-10 pb-20 md:grid-cols-2 md:gap-14">
      <div><button type="button" onClick={() => setZoomOpen(true)} aria-label="Zoom product image" className="block w-full overflow-hidden bg-[#eee8df]"><img src={image} alt={product.images[selectedImage]?.alt ?? product.name} className="aspect-[4/5] w-full object-cover transition-transform duration-500 hover:scale-105"/></button>{product.images.length > 1 && <div className="mt-3 grid grid-cols-4 gap-3">{product.images.map((item, index) => <button key={item.url} aria-label={`View product image ${index + 1}`} aria-pressed={selectedImage === index} onClick={() => setSelectedImage(index)} className={`overflow-hidden border-2 ${selectedImage === index ? "border-gold" : "border-transparent"}`}><img src={item.url} alt={item.alt} className="aspect-square w-full object-cover"/></button>)}</div>}</div>
      <div className="md:sticky md:top-28 md:self-start"><p className="eyebrow">{product.brand}</p><h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{product.name}</h1><p className="mt-3 text-sm text-muted">{product.concentration} · {product.gender} · {product.scentFamily.join(" / ")}</p><div className="mt-4 flex items-center gap-2 text-sm"><Star size={15} className="fill-gold text-gold"/><strong>{product.rating.toFixed(1)}</strong><span className="text-muted">({product.reviewCount} reviews)</span></div>
        <p className="mt-6 text-sm leading-7 text-muted">{product.description}</p>
        <button type="button" onClick={handleWishlist} aria-pressed={isSaved} className="mt-6 inline-flex items-center gap-2 border border-ink/20 px-4 py-3 text-xs uppercase tracking-widest"><Heart size={15} className={isSaved ? "fill-gold text-gold" : ""}/>{isSaved ? "Saved to wishlist" : "Add to wishlist"}</button>
        <div className="mt-8"><p className="text-xs font-semibold uppercase tracking-widest">Choose your size</p><div className="mt-3 grid grid-cols-3 gap-2">{product.variants.map(item => <button key={item.id} disabled={item.stock < 1} onClick={() => setSelectedVariantId(item.id)} className={`border p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${selectedVariantId === item.id ? "border-gold bg-[#eee8df]" : "border-ink/15"}`}><span className="block text-sm font-semibold">{item.size} ml</span><span className="mt-1 block text-xs text-muted">{money.format(item.price)}</span>{item.stock < 1 && <span className="mt-1 block text-[10px]">Sold out</span>}</button>)}</div></div>
        <div className="mt-6 flex items-center gap-3"><p className="font-display text-3xl">{money.format(variant.price)}</p>{variant.compareAtPrice && <p className="text-sm text-muted line-through">{money.format(variant.compareAtPrice)}</p>}</div><p className={`mt-2 text-xs ${inStock ? "text-sage" : "text-red-700"}`}>{inStock ? `${variant.stock} available` : "Currently out of stock"}</p><Button className="mt-5 w-full" disabled={!inStock} onClick={handleAdd}>{inStock ? "Add to bag" : "Notify me when available"}</Button>
        <div className="mt-6 space-y-3 border-t border-ink/10 pt-5 text-xs text-muted"><p className="flex items-center gap-2"><ShieldCheck size={16} className="text-gold"/> Authenticity guarantee</p><p className="flex items-center gap-2"><Check size={16} className="text-gold"/> Secure checkout</p><p>Batch information: {product.batchInformation}</p></div>
      </div>
    </section>
    <section className="border-t border-ink/10 py-16"><FragrancePyramid notes={product.notes}/></section>
    <section className="border-t border-ink/10 py-14"><p className="eyebrow">Know your fragrance</p><h2 className="mt-2 font-display text-3xl">The details</h2><div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4"><Attribute label="Concentration" value={product.concentration}/><Attribute label="Longevity" value={product.longevity}/><Attribute label="Sillage" value={product.sillage}/><Attribute label="Occasion" value={product.occasion.join(", ")}/><Attribute label="Season" value={product.season.join(", ")}/><Attribute label="Gender" value={product.gender}/><Attribute label="Scent family" value={product.scentFamily.join(", ")}/></div></section>
    <section className="border-t border-ink/10 py-14"><div className="grid gap-8 lg:grid-cols-[1fr_420px]"><div><p className="eyebrow">Customer impressions</p><h2 className="mt-2 font-display text-3xl">Reviews {reviewData?.data.total ? `(${reviewData.data.total})` : ""}</h2>{reviewData?.data.reviews?.length ? <div className="mt-6 space-y-6">{reviewData.data.reviews.map(review=><article key={review.id} className="border-b border-ink/10 pb-5"><p className="text-sm font-semibold">{review.title}</p><p className="mt-2 text-sm leading-6 text-muted">{review.comment}</p><p className="mt-2 text-xs text-muted">{review.rating}/5 · {new Date(review.createdAt).toLocaleDateString("en-IN")}</p></article>)}</div> : <p className="mt-4 text-sm text-muted">Be the first to share your impression of this fragrance.</p>}</div><ReviewForm productId={product.id}/></div></section>
    {related.length > 0 && <section className="border-t border-ink/10 py-16"><p className="eyebrow">You may also love</p><h2 className="mt-2 font-display text-3xl">Similar fragrances</h2><div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">{related.map(item => <ProductCard key={item.id} product={item}/>)}</div></section>}
    {recentSlugs.length > 0 && <section className="border-t border-ink/10 py-16"><p className="eyebrow">A second look</p><h2 className="mt-2 font-display text-3xl">Recently viewed</h2><div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">{catalogue.filter(item => recentSlugs.includes(item.slug)).map(item => <ProductCard key={item.id} product={item}/>)}</div></section>}
    {zoomOpen && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/90 p-5" role="dialog" aria-modal="true" aria-label="Product image zoom" onClick={() => setZoomOpen(false)}><button type="button" className="absolute right-6 top-6 text-sm text-white underline" onClick={() => setZoomOpen(false)}>Close</button><img src={image} alt={product.images[selectedImage]?.alt ?? product.name} className="max-h-[88vh] max-w-full object-contain"/></div>}
  </Container>;
}

function Attribute({ label, value }: { label: string; value: string }) {
  return <div className="border-t border-ink/15 pt-3"><p className="text-[10px] uppercase tracking-widest text-muted">{label}</p><p className="mt-2 text-sm capitalize">{value}</p></div>;
}
