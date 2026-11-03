import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeItem, setQuantity } from "@/store/slices/cartSlice";
import { formatMoney, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/features/checkout/utils/formatMoney";

export function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(state => state.cart.items);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  return <Container>
    <div className="py-12 sm:py-16">
      <p className="eyebrow">Your selection</p><h1 className="mt-3 font-display text-4xl sm:text-5xl">Shopping bag</h1>
      {items.length === 0 ? <div className="py-20 text-center"><ShoppingBag className="mx-auto text-muted" size={34}/><h2 className="mt-5 font-display text-2xl">Your bag is waiting to be discovered</h2><p className="mt-2 text-sm text-muted">Explore fragrances and find your signature scent.</p><Link to="/shop" className="mt-7 inline-block"><Button>Explore the collection</Button></Link></div> :
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {items.map(item => <article key={item.id} className="grid grid-cols-[88px_1fr] gap-4 py-5 sm:grid-cols-[120px_1fr_auto] sm:gap-6">
            <img src={item.image} alt={item.name} className="aspect-[4/5] w-full bg-beige object-cover"/>
            <div><Link to={item.slug ? `/product/${item.slug}` : "/shop"} className="font-display text-xl">{item.name}</Link><p className="mt-1 text-xs text-muted">{item.size}</p><p className="mt-3 text-sm font-semibold">{formatMoney(item.price)}</p>
              <div className="mt-4 inline-flex items-center border border-ink/20"><button className="p-2" aria-label="Decrease quantity" onClick={() => dispatch(setQuantity({id:item.id, quantity:item.quantity-1}))}><Minus size={13}/></button><span className="min-w-8 text-center text-xs">{item.quantity}</span><button className="p-2" aria-label="Increase quantity" onClick={() => dispatch(setQuantity({id:item.id, quantity:item.quantity+1}))} disabled={item.quantity >= (item.stock ?? 99)}><Plus size={13}/></button></div>
              <button onClick={() => dispatch(removeItem(item.id))} className="ml-4 inline-flex items-center gap-1 text-xs text-muted hover:text-red-700"><Trash2 size={13}/> Remove</button>
            </div>
            <p className="col-span-2 text-sm font-semibold sm:col-span-1 sm:pt-1">{formatMoney(item.price * item.quantity)}</p>
          </article>)}
        </div>
        <aside className="h-fit border border-ink/10 p-6">
          <h2 className="font-display text-2xl">Order summary</h2><div className="mt-6 flex justify-between text-sm"><span className="text-muted">Subtotal</span><span>{formatMoney(subtotal)}</span></div>
          <div className="mt-3 flex justify-between text-sm"><span className="text-muted">Shipping</span><span>{shipping === 0 ? "Complimentary" : formatMoney(shipping)}</span></div>
          <p className="mt-3 text-xs text-muted">{subtotal >= FREE_SHIPPING_THRESHOLD ? "You qualify for complimentary shipping." : `Add ${formatMoney(FREE_SHIPPING_THRESHOLD - subtotal)} more for complimentary shipping.`}</p>
          <div className="my-6 border-t border-ink/10 pt-5 flex justify-between font-semibold"><span>Total</span><span>{formatMoney(total)}</span></div>
          <Link to="/checkout"><Button className="w-full">Proceed to checkout</Button></Link>
          <Link to="/shop" className="mt-4 block text-center text-xs underline underline-offset-4">Continue shopping</Link>
        </aside>
      </div>}
    </div>
  </Container>;
}
