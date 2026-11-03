import { useState } from "react";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/common/Button";
import { reviewService } from "@/features/reviews/services/reviewService";
import { useAppSelector } from "@/store/hooks";
import { Link } from "react-router-dom";

const schema=z.object({rating:z.number().int().min(1).max(5),title:z.string().trim().min(3,"Add a short review title").max(80),comment:z.string().trim().min(20,"Please write at least 20 characters").max(1200)});
export function ReviewForm({productId}:{productId:string}){
 const user=useAppSelector(s=>s.auth.user);const status=useAppSelector(s=>s.auth.status);const qc=useQueryClient();
 const [rating,setRating]=useState(5);const [title,setTitle]=useState("");const [comment,setComment]=useState("");const [message,setMessage]=useState("");
 const mutation=useMutation({mutationFn:()=>{const payload=schema.parse({rating,title,comment});return reviewService.create({productId,...payload});},onSuccess:()=>{setMessage("Thank you. Your review has been submitted for moderation.");setTitle("");setComment("");setRating(5);qc.invalidateQueries({queryKey:["my-reviews"]});}});
 if(status!=="authenticated")return <div className="border border-ink/10 p-5"><p className="text-sm">Sign in to share your experience.</p><Link to="/login" className="mt-2 inline-block text-sm underline">Sign in</Link></div>;
 return <form onSubmit={e=>{e.preventDefault();setMessage("");mutation.mutate();}} className="border border-ink/10 p-5 sm:p-7"><p className="eyebrow">Your experience</p><h3 className="mt-2 font-display text-2xl">Write a review</h3><div className="mt-5"><span className="text-xs uppercase tracking-wider">Your rating</span><div className="mt-2 flex gap-2">{Array.from({length:5},(_,i)=><button type="button" key={i} onClick={()=>setRating(i+1)} aria-label={`${i+1} stars`}><Star size={23} className={i<rating?"fill-gold text-gold":"text-ink/20"}/></button>)}</div></div>
 <label className="mt-5 block"><span className="mb-2 block text-xs uppercase tracking-wider">Review title</span><input value={title} onChange={e=>setTitle(e.target.value)} maxLength={80} className="w-full border border-ink/20 px-3 py-3 text-sm"/></label>
 <label className="mt-4 block"><span className="mb-2 block text-xs uppercase tracking-wider">Your comments</span><textarea value={comment} onChange={e=>setComment(e.target.value)} rows={4} maxLength={1200} className="w-full border border-ink/20 px-3 py-3 text-sm"/></label>
 {mutation.isError&&<p role="alert" className="mt-3 text-sm text-red-700">{mutation.error.message}</p>}{message&&<p className="mt-3 text-sm text-sage">{message}</p>}<Button type="submit" className="mt-5" disabled={mutation.isPending}>{mutation.isPending?"Submitting…":"Submit review"}</Button>
 </form>;
}
