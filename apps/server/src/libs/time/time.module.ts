import { Module } from '@nestjs/common';
import { SystemClock } from './system-clock';
import { CLOCK_PORT } from './clock.port';

@Module({
  providers: [
    {
      provide: CLOCK_PORT,
      useClass: SystemClock,
    },
  ],
  exports: [CLOCK_PORT],
})
export class TimeModule {}
