import { ClockPort } from './clock.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SystemClock implements ClockPort {
  now(): Date {
    return new Date();
  }
}
