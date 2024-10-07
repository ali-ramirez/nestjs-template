// infrastructure/observability/telemetry-logs.config.ts
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { logger } from '../../logging/config/logger.config'; // Importa el logger de Winston

export function configureOpenTelemetryLogging() {
  // Crea la instrumentación de Winston
  new WinstonInstrumentation({
    // Si tienes opciones específicas, las puedes agregar aquí
  });

  logger.info('OpenTelemetry integrated with Winston'); // Usar el logger para registrar el mensaje
}
