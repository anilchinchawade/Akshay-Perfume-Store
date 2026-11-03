import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { Button } from "@/components/common/Button";
import { authService } from "@/features/auth/services/authService";
import { useAppDispatch } from "@/store/hooks";
import { setAuthenticated } from "@/store/slices/authSlice";

const schema = z.object({email:z.string().email("Enter a valid email"),password:z.string().min(8,"Password must contain at least 8 characters")});
export function LoginPage() {
  const dispatch=useAppDispatch(); const navigate=useNavigate(); const location=useLocation();
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  const submit=async(e:FormEvent)=>{e.preventDefault();setError("");const parsed=schema.safeParse({email,password});if(!parsed.success){setError(parsed.error.issues[0]?.message??"Check your details");return;}setBusy(true);try{const result=await authService.login(parsed.data);dispatch(setAuthenticated(result.data.user));navigate((location.state as {from?:string}|null)?.from??"/account",{replace:true});}catch(err){setError(err instanceof Error?err.message:"Unable to sign in.");}finally{setBusy(false);}};
  return <AuthLayout><p className="eyebrow">Welcome back</p><h1 className="mt-2 font-display text-3xl">Sign in</h1><p className="mt-2 text-sm text-muted">Return to your personal fragrance wardrobe.</p>
    <form onSubmit={submit} className="mt-8 space-y-5"><label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider">Email address</span><input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border border-ink/20 px-3 py-3 text-sm outline-none focus:border-gold"/></label>
    <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider">Password</span><input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border border-ink/20 px-3 py-3 text-sm outline-none focus:border-gold"/></label>
    {error&&<p role="alert" className="text-sm text-red-700">{error}</p>}<Button type="submit" className="w-full" disabled={busy}>{busy?"Signing in…":"Sign in"}</Button></form>
    <p className="mt-6 text-center text-sm text-muted">New to SCENTNSILLAGE? <Link to="/register" className="font-semibold text-ink underline">Create an account</Link></p>
  </AuthLayout>;
}
