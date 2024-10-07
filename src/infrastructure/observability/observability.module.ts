import { Module, OnModuleInit } from '@nestjs/common';
import { LoggingModule } from '../logging/logging.module';
import { LoggingService } from '../logging/logging.service';
import { configureOpenTelemetryLogging } from './config/telemetry-logs.config';
import { configureTelemetry } from './config/telemetry.config';
import { configureOpenTelemetryTraces } from './config/traces.config';
import { configureOpenTelemetryMetrics } from './config/metrics.config';
import { TracesService } from './services/traces.service';
import { MetricsService } from './services/metrics.service';

@Module({
  providers: [MetricsService, TracesService, LoggingService],
  imports: [LoggingModule],
  exports: [MetricsService, TracesService, LoggingService],
})
export class ObservabilityModule implements OnModuleInit {
  constructor(private loggingService: LoggingService) {} // Inyección del servicio de logging

  async onModuleInit() {
    // Inicializar todas las configuraciones relacionadas con observabilidad
    await this.initializeTelemetry();

    // Si quieres hacer un log en la inicialización
    this.loggingService.log('Observability module initialized with OpenTelemetry.');
  }

  private async initializeTelemetry() {
    // Inicializar la configuración principal de OpenTelemetry (métricas y trazas)
    configureTelemetry(); // Esto cubre métricas y trazas principales
    configureOpenTelemetryTraces(); // Inicializar trazas
    configureOpenTelemetryMetrics(); // Inicializar métricas

    // Integrar OpenTelemetry con Winston (logs)
    configureOpenTelemetryLogging();
  }
}
