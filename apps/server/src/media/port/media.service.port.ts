import { Result } from '@/libs/result';
export const MEDIA_SERVICE_PORT = Symbol('MEDIA_SERVICE');
export interface MediaServicePort {
  upload(
    buffer: Buffer,
    key: string,
    contentType: string,
  ): Promise<Result<string, string>>;
}
