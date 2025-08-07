import { AxiosError } from 'axios';

export interface User {
  userId: string;
  email: string;
  role: string;
  loginAt: string;
  jwtToken: string;
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
