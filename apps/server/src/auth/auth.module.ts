import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [
    BetterAuthModule.forRoot(auth, {
      disableBodyParser: true,
      disableExceptionFilter: false,
      disableTrustedOriginsCors: false,
    }),
    PrismaModule,
  ],
  exports: [],
})
export class AuthModule {}
