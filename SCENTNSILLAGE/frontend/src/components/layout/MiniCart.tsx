import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeItem, setCartOpen } from "@/store/slices/cartSlice";
import { Button } from "@/components/common/Button";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export function MiniCart() {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.cart);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-ink/40" onClick={() => dispatch(setCartOpen(false))}>
      <aside
        className="ml-auto flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mini-cart-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 id="mini-cart-title" className="font-display text-2xl">Your bag ({items.length})</h2>
          <button aria-label="Close cart" onClick={() => dispatch(setCartOpen(false))}><X /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag size={34} className="mb-4 text-gold" />
              <p className="font-display text-2xl">Your bag is waiting</p>
              <p className="mt-2 text-sm text-muted">Discover a fragrance that feels like you.</p>
              <Button className="mt-6" onClick={() => dispatch(setCartOpen(false))}>Continue shopping</Button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 border-b border-ink/10 pb-5">
                  <img src={item.image} alt="" className="h-24 w-20 object-cover" />
                  <div className="flex flex-1 flex-col">
                    <span className="font-display text-lg">{item.name}</span>
                    <span className="mt-1 text-xs text-muted">{item.size} · Qty {item.quantity}</span>
                    <span className="mt-auto text-sm font-semibold">{currency.format(item.price * item.quantity)}</span>
                  </div>
                  <button
                    className="self-start p-2 text-muted hover:text-ink"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => dispatch(removeItem(item.id))}
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-ink/10 px-6 py-5">
            <div className="mb-4 flex justify-between text-sm">
              <span>Subtotal</span><strong>{currency.format(subtotal)}</strong>
            </div>
            <p className="mb-4 text-xs text-muted">Shipping and taxes are calculated at checkout.</p>
            <Button className="w-full" onClick={() => dispatch(setCartOpen(false))}>Continue to checkout</Button>
          </div>
        )}
      </aside>
    </div>
  );
}
