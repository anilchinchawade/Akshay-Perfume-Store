import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/common/Container";
export function AuthLayout({children}:PropsWithChildren) {
  return <Container><div className="mx-auto max-w-md py-14 sm:py-20"><Link to="/" className="brand-mark mx-auto block text-center">SCENTNSILLAGE<span>THE ART OF FRAGRANCE</span></Link><div className="mt-12 border border-ink/10 bg-white p-6 sm:p-9">{children}</div></div></Container>;
}
