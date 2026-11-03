import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

export function ProtectedRoute({children}:PropsWithChildren) {
  const status = useAppSelector(state => state.auth.status);
  const location = useLocation();
  if (status === "unknown") return <div className="mx-auto min-h-[45vh] max-w-6xl animate-pulse px-6 py-20"><div className="h-8 w-1/3 bg-beige"/><div className="mt-6 h-40 bg-beige"/></div>;
  if (status !== "authenticated") return <Navigate to="/login" replace state={{from:location.pathname}}/>;
  return <>{children}</>;
}
