import { Module } from '@nestjs/common';
import { BucketR2Service } from './services/bucket.r2.service';
import { BUCKET_SERVICE_PORT } from '../port/bucket.service.port';
import { BucketController } from './controllers/bucket.controller';
@Module({
  providers: [
    BucketR2Service,
    { provide: BUCKET_SERVICE_PORT, useClass: BucketR2Service },
  ],
  controllers: [BucketController],
  exports: [BUCKET_SERVICE_PORT],
})
export class BucketInfrastructure {}
