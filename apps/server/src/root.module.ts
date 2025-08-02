import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ContextsModule } from './contexts/contexts.module';
import { HealthModule } from './health/health.module';
import { MediaInfrastructure } from './media/infrastructure/media.infrastructure';
// import { AuthModule } from './auth/auth.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './libs/auth';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule.forRoot(auth, {
      disableTrustedOriginsCors: false,
      disableExceptionFilter: false,
      disableBodyParser: false,
    }),
    ContextsModule,
    HealthModule,
    MediaInfrastructure,
  ],
  controllers: [],
  providers: [],
})
export class RootModule {}
