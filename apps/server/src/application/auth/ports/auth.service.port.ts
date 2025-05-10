import { Result } from '@shared/result';
export const AUTH_SERVICE_PORT = Symbol('AuthService');
export interface AuthServicePort {
  signIn(email: string, password: string): Promise<Result<any, string>>;
  signUp({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<Result<{ userId: string; authProviderResponse: any }, string>>;
}
