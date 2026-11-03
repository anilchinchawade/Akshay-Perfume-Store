import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
import { formatMoney, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/features/checkout/utils/formatMoney";
import { paymentService } from "@/features/checkout/services/paymentService";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, callback: (response: Record<string, string>) => void) => void };
  }
}
const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  address: z.string().trim().min(8, "Enter your complete address"),
  city: z.string().trim().min(2, "Enter your city"),
  state: z.string().trim().min(2, "Enter your state"),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code")
});
type FormValues = z.infer<typeof checkoutSchema>;
const initial: FormValues = { fullName:"", email:"", phone:"", address:"", city:"", state:"", pincode:"" };

function loadRazorpay(): Promise<boolean> {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector(state => state.cart.items);
  const subtotal = items.reduce((sum,item) => sum + item.price * item.quantity,0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const [values,setValues] = useState<FormValues>(initial);
  const [errors,setErrors] = useState<Partial<Record<keyof FormValues,string>>>({});
  const [busy,setBusy] = useState(false);
  const [paymentError,setPaymentError] = useState("");

  const update = (key:keyof FormValues,value:string) => setValues(current => ({...current,[key]:value}));
  const field = (key:keyof FormValues,label:string,wide=false) => <label className={wide ? "block sm:col-span-2" : "block"}><span className="mb-2 block text-xs font-semibold uppercase tracking-wider">{label}</span><input value={values[key]} onChange={e=>update(key,e.target.value)} className="w-full border border-ink/20 bg-white px-3 py-3 text-sm outline-none focus:border-gold" aria-invalid={Boolean(errors[key])}/>{errors[key] && <span className="mt-1 block text-xs text-red-700">{errors[key]}</span>}</label>;

  const pay = async () => {
    const parsed = checkoutSchema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<keyof FormValues,string>> = {};
      parsed.error.issues.forEach(issue => { const key = issue.path[0] as keyof FormValues; next[key] = issue.message; });
      setErrors(next); return;
    }
    if (!items.length) return;
    setErrors({}); setPaymentError(""); setBusy(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded || !window.Razorpay) throw new Error("Razorpay checkout could not be loaded. Check your internet connection.");
      const order = await paymentService.createOrder({ amount: Math.round(total * 100), currency:"INR", receipt:`sns_${Date.now()}` });
      const razorpay = new window.Razorpay({
        key: order.data.keyId,
        amount: order.data.amount,
        currency: order.data.currency,
        name: "SCENTNSILLAGE",
        description: "Your fragrance order",
        order_id: order.data.orderId,
        prefill: { name:values.fullName,email:values.email,contact:values.phone },
        notes: { delivery_city:values.city, delivery_pincode:values.pincode },
        theme: { color:"#B28A52" },
        handler: async (response:Record<string,string>) => {
          try {
            const verified = await paymentService.verify({
              razorpay_order_id:response.razorpay_order_id,
              razorpay_payment_id:response.razorpay_payment_id,
              razorpay_signature:response.razorpay_signature
            });
            if (!verified.data.verified) throw new Error("Payment verification failed.");
            const reference = `SNS-${Date.now().toString().slice(-8)}`;
            sessionStorage.setItem("scentnsillage-last-order",JSON.stringify({reference,paymentId:verified.data.paymentId,total,customer:values,items}));
            dispatch(clearCart());
            navigate(`/order-confirmation/${reference}`);
          } catch (error) {
            setPaymentError(error instanceof Error ? error.message : "Payment verification failed. Contact support before retrying.");
          } finally { setBusy(false); }
        }
      });
      razorpay.on("payment.failed",(response:Record<string,string>) => { setPaymentError(response.description ?? "Payment was not completed."); setBusy(false); });
      razorpay.open();
      setBusy(false);
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "Unable to start payment.");
      setBusy(false);
    }
  };

  if (!items.length) return <Container><div className="py-24 text-center"><h1 className="font-display text-3xl">Your bag is empty</h1><a href="/shop" className="mt-5 inline-block underline">Return to the collection</a></div></Container>;

  return <Container><div className="py-12 sm:py-16"><p className="eyebrow">Almost yours</p><h1 className="mt-3 font-display text-4xl sm:text-5xl">Checkout</h1>
    <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
      <section><h2 className="font-display text-2xl">Delivery details</h2><div className="mt-6 grid gap-5 sm:grid-cols-2">{field("fullName","Full name")}{field("email","Email address")}{field("phone","Mobile number")}{field("pincode","PIN code")}{field("address","Full address",true)}{field("city","City")}{field("state","State")}</div>
        <p className="mt-6 text-xs leading-5 text-muted">Your details are used only to process this order and arrange delivery. Payment is handled securely by Razorpay.</p>
        {paymentError && <p role="alert" className="mt-5 border border-red-200 bg-red-50 p-3 text-sm text-red-800">{paymentError}</p>}
      </section>
      <aside className="h-fit border border-ink/10 p-6"><h2 className="font-display text-2xl">Order summary</h2><div className="mt-5 space-y-4">{items.map(item=><div key={item.id} className="flex gap-3"><img src={item.image} alt="" className="h-16 w-12 object-cover"/><div className="min-w-0 flex-1"><p className="text-sm">{item.name}</p><p className="text-xs text-muted">{item.size} · Qty {item.quantity}</p></div><span className="text-sm">{formatMoney(item.price*item.quantity)}</span></div>)}</div>
        <div className="mt-6 border-t border-ink/10 pt-5 text-sm"><div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatMoney(subtotal)}</span></div><div className="mt-3 flex justify-between"><span className="text-muted">Shipping</span><span>{shipping===0?"Complimentary":formatMoney(shipping)}</span></div><div className="mt-5 flex justify-between border-t border-ink/10 pt-4 text-base font-semibold"><span>Total</span><span>{formatMoney(total)}</span></div></div>
        <Button className="mt-6 w-full" onClick={pay} disabled={busy}>{busy ? "Preparing secure payment…" : `Pay ${formatMoney(total)}`}</Button><p className="mt-3 text-center text-[10px] leading-5 text-muted">Secure payment · Razorpay test/live mode depends on server credentials</p>
      </aside>
    </div>
  </div></Container>;
}
