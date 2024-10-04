import { LoggingService } from '@/infrastructure/logging/logging.service';
import { Controller, Get, Logger } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { HealthCheckService } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly logging: LoggingService,
  ) {}

  @Get()
  @HealthCheck()
  async checkHealth() {
    this.logging.log('Health check requested');
    try {
      return await this.healthCheckService.check([]);
    } catch (error) {
      this.logger.error('Health check failed', error.stack);
      throw new Error('Health check failed');
    }
  }
}
