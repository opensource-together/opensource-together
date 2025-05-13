import { AuthServicePort } from '../ports/auth.service.port';
export class AuthServiceMock implements AuthServicePort {
  signUp = jest.fn();
  signIn = jest.fn();
}
