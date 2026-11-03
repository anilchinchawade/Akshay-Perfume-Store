import { apiRequest } from "@/services/apiClient";
import type { AuthResponse, LoginPayload, MessageResponse, RegisterPayload } from "@/features/auth/types/auth.types";
import type { Customer } from "@/store/slices/authSlice";

export const authService = {
  register: (payload: RegisterPayload) => apiRequest<AuthResponse>("/auth/register", { method:"POST", body:payload }),
  login: (payload: LoginPayload) => apiRequest<AuthResponse>("/auth/login", { method:"POST", body:payload }),
  me: () => apiRequest<{success:boolean;data:{user:Customer}}>("/auth/me"),
  logout: () => apiRequest<MessageResponse>("/auth/logout", { method:"POST" }),
  updateProfile: (payload: {fullName:string;phone?:string}) =>
    apiRequest<{success:boolean;data:{user:Customer}}>("/users/me", {method:"PATCH",body:payload}),
  changePassword: (payload: {currentPassword:string;newPassword:string}) =>
    apiRequest<MessageResponse>("/auth/change-password", {method:"PATCH",body:payload})
};
