import { Controller, Get, Logger } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { HealthCheckService } from '@nestjs/terminus';
import { TracesService } from '@/infrastructure/observability/services/traces.service'; // Importar TracesService
import { MetricsService } from '@/infrastructure/observability/services/metrics.service'; // Importar MetricsService
import { LoggingService } from '@/infrastructure/logging/logging.service';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly logging: LoggingService,
    private readonly tracesService: TracesService, // Inyectar TracesService
    private readonly metricsService: MetricsService, // Inyectar MetricsService
  ) {}

  @Get()
  @HealthCheck()
  async checkHealth() {
    return this.tracesService.withSpan('checkHealth', async () => {
      this.logging.log('Health check requested');
      this.metricsService.incrementCounter('health_check_requests');

      try {
        const result = await this.healthCheckService.check([]);
        this.logging.log('Health check succeeded');
        return result;
      } catch (error) {
        this.logger.error('Health check failed', error.stack);
        throw new Error('Health check failed');
      }
    });
  }
}
