import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

export function AdminRoute() {
  const { user, status } = useAppSelector(state => state.auth);
  const location = useLocation();
  if (status === "unknown") return <div className="p-10 text-center">Checking administrator access…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (user.role !== "admin") return <Navigate to="/account" replace />;
  return <Outlet />;
}
