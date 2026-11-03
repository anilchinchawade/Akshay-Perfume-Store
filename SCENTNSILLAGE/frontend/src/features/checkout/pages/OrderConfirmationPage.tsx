import { Link, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { formatMoney } from "@/features/checkout/utils/formatMoney";

export function OrderConfirmationPage() {
  const { reference = "" } = useParams();
  let order: {reference:string;paymentId:string;total:number;customer:{fullName:string}} | null = null;
  try { order = JSON.parse(sessionStorage.getItem("scentnsillage-last-order") ?? "null"); } catch { order = null; }
  return <Container><div className="mx-auto max-w-2xl py-20 text-center"><CheckCircle2 size={54} className="mx-auto text-sage"/><p className="eyebrow mt-7">A beautiful choice</p><h1 className="mt-3 font-display text-4xl sm:text-5xl">Thank you for your order.</h1><p className="mt-4 text-sm leading-7 text-muted">{order?.customer?.fullName ? `Thank you, ${order.customer.fullName}. ` : ""}Your payment has been verified. We’re preparing your fragrance experience.</p><div className="mt-8 border-y border-ink/10 py-6 text-sm"><div className="flex justify-between"><span className="text-muted">Order reference</span><strong>{reference}</strong></div>{order?.total != null && <div className="mt-3 flex justify-between"><span className="text-muted">Paid</span><strong>{formatMoney(order.total)}</strong></div>}<div className="mt-3 flex justify-between"><span className="text-muted">Payment ID</span><span className="max-w-[65%] truncate">{order?.paymentId ?? "Verified"}</span></div></div><Link to="/shop" className="mt-8 inline-block"><Button>Continue exploring</Button></Link></div></Container>;
}
