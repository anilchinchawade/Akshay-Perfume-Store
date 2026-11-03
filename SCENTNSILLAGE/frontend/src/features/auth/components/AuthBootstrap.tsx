import { useEffect, type PropsWithChildren } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setAuthenticated, setGuest } from "@/store/slices/authSlice";
import { authService } from "@/features/auth/services/authService";

export function AuthBootstrap({children}:PropsWithChildren) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    let active = true;
    authService.me()
      .then(result => { if (active) dispatch(setAuthenticated(result.data.user)); })
      .catch(() => { if (active) dispatch(setGuest()); });
    return () => { active = false; };
  },[dispatch]);
  return <>{children}</>;
}
