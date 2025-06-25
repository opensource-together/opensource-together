import { Module } from '@nestjs/common';
import { TechstackController } from './techstack.controller';

@Module({
  controllers: [TechstackController],
})
export class TechstackModule {}
