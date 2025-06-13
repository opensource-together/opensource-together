import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { PublicAccess } from 'supertokens-nestjs';

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @PublicAccess()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([]);
  }
}
