import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { PublicAccess } from 'supertokens-nestjs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('System')
@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @PublicAccess()
  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: "Vérifier l'état de santé de l'API",
    description:
      "Endpoint pour vérifier si l'API est opérationnelle. Utilisé pour les health checks et monitoring.",
  })
  @ApiResponse({
    status: 200,
    description: 'API opérationnelle',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        info: { type: 'object', example: {} },
        error: { type: 'object', example: {} },
        details: { type: 'object', example: {} },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Service indisponible - un ou plusieurs checks ont échoué',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        info: { type: 'object', example: {} },
        error: { type: 'object', example: {} },
        details: { type: 'object', example: {} },
      },
    },
  })
  check() {
    return this.health.check([]);
  }
}
