import { Module } from '@nestjs/common';
import { AuthController } from '@/auth/controllers/auth.controller';

@Module({
  controllers: [AuthController],
})
export class AuthModule {}
