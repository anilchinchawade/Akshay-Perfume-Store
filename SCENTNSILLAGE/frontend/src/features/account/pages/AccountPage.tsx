import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Heart, UserRound, LogOut, Star } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { useAppDispatch,useAppSelector } from "@/store/hooks";
import { setGuest,updateCustomer } from "@/store/slices/authSlice";
import { authService } from "@/features/auth/services/authService";
import { accountService } from "@/features/account/services/accountService";

export function AccountPage(){
 const user=useAppSelector(s=>s.auth.user);const dispatch=useAppDispatch();const navigate=useNavigate();const qc=useQueryClient();
 const [fullName,setFullName]=useState(user?.fullName??"");const [phone,setPhone]=useState(user?.phone??"");const [message,setMessage]=useState("");
 const mutation=useMutation({mutationFn:()=>accountService.updateProfile({fullName,phone}),onSuccess:r=>{dispatch(updateCustomer(r.data.user));setMessage("Your profile has been updated.");}});
 const logout=async()=>{try{await authService.logout();}finally{dispatch(setGuest());qc.clear();navigate("/login");}};
 return <Container><div className="py-12 sm:py-16"><p className="eyebrow">Your personal space</p><h1 className="mt-3 font-display text-4xl sm:text-5xl">Hello, {user?.fullName?.split(" ")[0]??"there"}.</h1><p className="mt-3 text-sm text-muted">Manage your details and discover your order history.</p>
 <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]"><aside className="space-y-2"><Link to="/account/orders" className="flex items-center gap-3 border border-ink/10 p-4 text-sm"><Package size={17}/> My orders</Link><Link to="/wishlist" className="flex items-center gap-3 border border-ink/10 p-4 text-sm"><Heart size={17}/> Wishlist</Link><Link to="/account/reviews" className="flex items-center gap-3 border border-ink/10 p-4 text-sm"><Star size={17}/> My reviews</Link><button onClick={logout} className="flex w-full items-center gap-3 border border-ink/10 p-4 text-sm"><LogOut size={17}/> Sign out</button></aside>
 <section className="border border-ink/10 p-6 sm:p-8"><div className="flex items-center gap-3"><UserRound/><h2 className="font-display text-2xl">Profile details</h2></div><form className="mt-7 max-w-lg space-y-5" onSubmit={e=>{e.preventDefault();mutation.mutate();}}><label className="block"><span className="mb-2 block text-xs uppercase tracking-wider">Full name</span><input value={fullName} onChange={e=>setFullName(e.target.value)} className="w-full border border-ink/20 px-3 py-3 text-sm"/></label><label className="block"><span className="mb-2 block text-xs uppercase tracking-wider">Email</span><input value={user?.email??""} readOnly className="w-full border border-ink/10 bg-beige/40 px-3 py-3 text-sm"/></label><label className="block"><span className="mb-2 block text-xs uppercase tracking-wider">Mobile number</span><input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full border border-ink/20 px-3 py-3 text-sm"/></label>{message&&<p className="text-sm text-sage">{message}</p>}{mutation.isError&&<p role="alert" className="text-sm text-red-700">{mutation.error.message}</p>}<Button type="submit" disabled={mutation.isPending}>{mutation.isPending?"Saving…":"Save changes"}</Button></form></section></div>
 </div></Container>;
}
