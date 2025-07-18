import { Result } from '@/libs/result';
export const MEDIA_SERVICE_PORT = Symbol('MEDIA_SERVICE');
export interface MediaServicePort {
  uploadPublicImage(
    image: Buffer,
    key: string,
    contentType: string,
  ): Promise<Result<string, string>>;

  deletePublicImage(key: string): Promise<Result<string, string>>;
}
