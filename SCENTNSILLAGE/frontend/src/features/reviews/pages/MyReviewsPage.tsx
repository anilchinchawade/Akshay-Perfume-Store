import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Container } from "@/components/common/Container";
import { reviewService } from "@/features/reviews/services/reviewService";
export function MyReviewsPage(){
 const {data,isLoading,isError,error}=useQuery({queryKey:["my-reviews"],queryFn:reviewService.mine});
 return <Container><div className="py-12 sm:py-16"><Link to="/account" className="text-xs underline">← My account</Link><p className="eyebrow mt-8">Your impressions</p><h1 className="mt-3 font-display text-4xl">My reviews</h1>
 {isLoading?<p className="mt-8 text-sm text-muted">Loading your reviews…</p>:isError?<p role="alert" className="mt-8 text-sm text-red-700">{error.message}</p>:!data?.data.reviews.length?<div className="mt-12 border border-ink/10 p-8 text-center"><Star className="mx-auto text-gold"/><h2 className="mt-4 font-display text-2xl">Your reviews will live here</h2><p className="mt-2 text-sm text-muted">Share your experience after discovering a fragrance.</p><Link to="/shop" className="mt-5 inline-block text-sm underline">Explore the collection</Link></div>:
 <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">{data.data.reviews.map(review=><article key={review.id} className="py-6"><Link to={`/product/${review.productSlug}`} className="font-display text-xl">{review.productName}</Link><div className="mt-2 flex items-center gap-1 text-gold">{Array.from({length:5},(_,i)=><Star key={i} size={13} className={i<review.rating?"fill-gold":""}/>)}</div><h2 className="mt-3 text-sm font-semibold">{review.title}</h2><p className="mt-2 text-sm leading-6 text-muted">{review.comment}</p><p className="mt-3 text-xs text-muted">Submitted {new Date(review.createdAt).toLocaleDateString("en-IN")} · {review.status}</p></article>)}</div>}
 </div></Container>;
}
