import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheckService, HttpHealthIndicator, HealthCheck } from '@nestjs/terminus';
import { PublicAccess } from 'supertokens-nestjs';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private config: ConfigService,
  ) {}

  @PublicAccess()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.responseCheck(
        'server',
        this.config.get("API_DOMAIN") || "",
        (res) => {
          return res.status === 404;
        },
      ),
    ]);
  }

}

