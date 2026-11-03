import type { Customer } from "@/store/slices/authSlice";
export interface AuthResponse { success: boolean; data: { user: Customer }; }
export interface MessageResponse { success: boolean; message: string; }
export interface RegisterPayload { fullName: string; email: string; phone?: string; password: string; }
export interface LoginPayload { email: string; password: string; }
