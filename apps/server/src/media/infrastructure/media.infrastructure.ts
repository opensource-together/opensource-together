import { Module } from '@nestjs/common';
import { R2MediaService } from './services/r2.media.service';
import { MEDIA_SERVICE_PORT } from '../port/media.service.port';
import { MediaController } from './controllers/media.controller';
@Module({
  providers: [
    R2MediaService,
    { provide: MEDIA_SERVICE_PORT, useClass: R2MediaService },
  ],
  controllers: [MediaController],
  exports: [MEDIA_SERVICE_PORT],
})
export class MediaInfrastructure {}
