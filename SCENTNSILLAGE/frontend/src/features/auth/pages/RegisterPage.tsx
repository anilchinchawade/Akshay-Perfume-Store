import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { Button } from "@/components/common/Button";
import { authService } from "@/features/auth/services/authService";
import { useAppDispatch } from "@/store/hooks";
import { setAuthenticated } from "@/store/slices/authSlice";

const schema=z.object({fullName:z.string().trim().min(2,"Enter your name"),email:z.string().email("Enter a valid email"),phone:z.string().regex(/^[6-9]\d{9}$/,"Enter a valid 10-digit Indian mobile number").optional().or(z.literal("")),password:z.string().min(8,"Use at least 8 characters").regex(/[A-Za-z]/,"Include a letter").regex(/[0-9]/,"Include a number"),confirmPassword:z.string()}).refine(v=>v.password===v.confirmPassword,{path:["confirmPassword"],message:"Passwords do not match"});
export function RegisterPage(){
  const dispatch=useAppDispatch();const navigate=useNavigate();
  const [form,setForm]=useState({fullName:"",email:"",phone:"",password:"",confirmPassword:""});const [error,setError]=useState("");const [busy,setBusy]=useState(false);
  const update=(key:keyof typeof form,value:string)=>setForm(v=>({...v,[key]:value}));
  const submit=async(e:FormEvent)=>{e.preventDefault();setError("");const parsed=schema.safeParse(form);if(!parsed.success){setError(parsed.error.issues[0]?.message??"Check your details");return;}setBusy(true);try{const {confirmPassword,...payload}=parsed.data;void confirmPassword;const result=await authService.register(payload);dispatch(setAuthenticated(result.data.user));navigate("/account");}catch(err){setError(err instanceof Error?err.message:"Unable to create account.");}finally{setBusy(false);}};
  const input=(key:keyof typeof form,label:string,type="text",auto="off")=><label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider">{label}</span><input type={type} autoComplete={auto} value={form[key]} onChange={e=>update(key,e.target.value)} className="w-full border border-ink/20 px-3 py-3 text-sm outline-none focus:border-gold"/></label>;
  return <AuthLayout><p className="eyebrow">Join our world</p><h1 className="mt-2 font-display text-3xl">Create account</h1><p className="mt-2 text-sm text-muted">Save favourites and keep track of every order.</p>
    <form onSubmit={submit} className="mt-8 space-y-4">{input("fullName","Full name","text","name")}{input("email","Email address","email","email")}{input("phone","Mobile number","tel","tel")}{input("password","Password","password","new-password")}{input("confirmPassword","Confirm password","password","new-password")}
      {error&&<p role="alert" className="text-sm text-red-700">{error}</p>}<Button type="submit" className="w-full" disabled={busy}>{busy?"Creating account…":"Create account"}</Button></form>
    <p className="mt-6 text-center text-sm text-muted">Already have an account? <Link to="/login" className="font-semibold text-ink underline">Sign in</Link></p>
  </AuthLayout>;
}
