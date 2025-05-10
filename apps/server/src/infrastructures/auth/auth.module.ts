import { Module } from '@nestjs/common';
import { SuperTokensModule } from 'supertokens-nestjs';
import { supertokensConfig } from '@infrastructures/auth/supertokens.config';
import { RepositoryModule } from '@infrastructures/repositories/repository.module';
import { AuthController } from '@/presentation/auth/auth.controller';
import { AUTH_SERVICE_PORT } from '@/application/auth/ports/auth.service.port';
import { AuthSupertokens } from '@infrastructures/auth/auth.supertokens';
import { authCommandsContainer } from '@/application/auth/commands/auth.commands';
@Module({
  imports: [RepositoryModule, SuperTokensModule.forRoot(supertokensConfig)],
  providers: [
    {
      provide: AUTH_SERVICE_PORT,
      useClass: AuthSupertokens,
    },
    ...authCommandsContainer,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
