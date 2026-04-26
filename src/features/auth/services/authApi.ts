import type { User, AuthTokens, LoginPayload, RegisterPayload } from '@/types/auth';

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface MessageResponse {
  message: string;
}

export interface AuthApiAdapter {
  login(payload: LoginPayload): Promise<AuthResponse>;
  register(payload: RegisterPayload): Promise<AuthResponse>;
  forgotPassword(email: string): Promise<MessageResponse>;
  resetPassword(token: string, password: string): Promise<MessageResponse>;
  logout(): Promise<void>;
}
