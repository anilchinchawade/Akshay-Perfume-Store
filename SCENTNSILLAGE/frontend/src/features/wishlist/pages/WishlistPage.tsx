import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeWishlistItem } from "@/store/slices/wishlistSlice";
import { addItem } from "@/store/slices/cartSlice";
import { formatMoney } from "@/features/checkout/utils/formatMoney";

export function WishlistPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(state => state.wishlist.items);
  return <Container><div className="py-12 sm:py-16"><p className="eyebrow">Your saved fragrances</p><h1 className="mt-3 font-display text-4xl sm:text-5xl">Wishlist</h1>
    {items.length === 0 ? <div className="py-20 text-center"><Heart className="mx-auto text-muted" size={34}/><h2 className="mt-5 font-display text-2xl">No saved fragrances yet</h2><p className="mt-2 text-sm text-muted">Tap the heart on a fragrance to keep it close.</p><Link to="/shop" className="mt-7 inline-block"><Button>Discover fragrances</Button></Link></div> :
    <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">{items.map(item => <article key={item.productId}>
      <Link to={`/product/${item.slug}`}><img src={item.image} alt={item.name} className="aspect-[4/5] w-full bg-beige object-cover"/><p className="mt-3 text-[10px] uppercase tracking-widest text-muted">{item.brand}</p><h2 className="mt-1 font-display text-lg">{item.name}</h2></Link>
      <p className="mt-2 text-sm font-semibold">{formatMoney(item.price)}</p>
      <div className="mt-3 flex gap-2"><Button size="sm" onClick={() => dispatch(addItem({id:`${item.productId}-wishlist`,productId:item.productId,slug:item.slug,name:item.name,size:"Selected size",price:item.price,quantity:1,image:item.image}))}>Add to bag</Button><button aria-label={`Remove ${item.name}`} onClick={() => dispatch(removeWishlistItem(item.productId))} className="border border-ink/20 px-3"><Trash2 size={14}/></button></div>
    </article>)}</div>}
  </div></Container>;
}
