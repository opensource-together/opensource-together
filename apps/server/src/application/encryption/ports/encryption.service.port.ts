import { Result } from '@/shared/result';

export const ENCRYPTION_SERVICE_PORT = Symbol('EncryptionService');

export interface EncryptionServicePort {
  encrypt(plaintext: string): Result<string, string>;
  decrypt(ciphertext: string): Result<string, string>;
}
