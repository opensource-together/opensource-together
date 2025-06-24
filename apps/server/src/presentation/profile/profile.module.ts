import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';

@Module({
  controllers: [ProfileController],
})
export class ProfileModule {}
