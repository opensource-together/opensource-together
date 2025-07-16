import { Result } from '@/libs/result';
export const BUCKET_SERVICE_PORT = Symbol('BUCKET_SERVICE');
export interface BucketServicePort {
  upload(
    buffer: Buffer,
    key: string,
    contentType: string,
  ): Promise<Result<string, string>>;
}
