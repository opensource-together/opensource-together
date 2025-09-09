import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { Public } from '@thallesp/nestjs-better-auth';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheckSwagger } from './swagger/swagger.decorator';

@ApiTags('System')
@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @Public()
  @Get()
  @HealthCheck()
  @HealthCheckSwagger()
  check() {
    return this.health.check([]);
  }
}
