import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { accountService } from "@/features/account/services/accountService";
import { formatMoney } from "@/features/checkout/utils/formatMoney";

const statusStyle:Record<string,string>={delivered:"text-sage",shipped:"text-blue-700",cancelled:"text-red-700",pending:"text-gold",confirmed:"text-ink",processing:"text-ink"};
export function OrdersPage(){
 const {data,isLoading,isError,error}=useQuery({queryKey:["my-orders"],queryFn:accountService.orders});
 return <Container><div className="py-12 sm:py-16"><Link to="/account" className="text-xs underline">← My account</Link><p className="eyebrow mt-8">Your purchases</p><h1 className="mt-3 font-display text-4xl">Order history</h1>
 {isLoading?<p className="mt-10 animate-pulse text-sm text-muted">Loading your orders…</p>:isError?<p role="alert" className="mt-8 text-sm text-red-700">{error.message}</p>:!data?.data.orders.length?<div className="py-20 text-center"><h2 className="font-display text-2xl">Your story starts with a fragrance</h2><p className="mt-2 text-sm text-muted">Completed purchases will appear here.</p><Link to="/shop" className="mt-6 inline-block"><Button>Explore fragrances</Button></Link></div>:
 <div className="mt-9 space-y-5">{data.data.orders.map(order=><article key={order.id} className="border border-ink/10 p-5 sm:p-7"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs text-muted">Order {order.orderNumber}</p><p className="mt-1 text-xs text-muted">{new Date(order.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</p></div><span className={`text-xs font-semibold uppercase tracking-wider ${statusStyle[order.status]??""}`}>{order.status}</span></div><div className="mt-5 flex flex-wrap gap-3">{order.items.map((item,i)=><div key={`${order.id}-${i}`} className="flex items-center gap-3"><img src={item.image} alt={item.productName} className="h-16 w-12 object-cover"/><div><p className="text-sm">{item.productName}</p><p className="text-xs text-muted">{item.size} · Qty {item.quantity}</p></div></div>)}</div><div className="mt-5 flex justify-between border-t border-ink/10 pt-4 text-sm"><span className="text-muted">Order total</span><strong>{formatMoney(order.total)}</strong></div>{order.trackingNumber&&<p className="mt-3 text-xs text-muted">Tracking: {order.trackingNumber}</p>}</article>)}</div>}
 </div></Container>;
}
