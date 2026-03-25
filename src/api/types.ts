import { AxiosError } from 'axios';

export interface User {
  id: number;
  userId: string;
  username: string
  email: string;
  role: string;
  loginAt: string;
}

export interface AuthTokens {
  accessToken: string;
  // refreshToken: string;
  // expiresAt: string;
}

export interface AuthState {
  user: User
  tokens: AuthTokens
}

export interface AuthResult {
  data: any;
  userId: string;
  jwtToken: string;
  user: User;
}

type AuthErrorData = {
  messages: {
    id: string;
    message: string;
  }[];
}[];

export type AuthError = AxiosError<{
  statusCode: number;
  error: string;
  message: AuthErrorData;
  data: AuthErrorData;
}>;

// 응답
export interface LoginResponse {
  accessToken: string
  user: User
}
