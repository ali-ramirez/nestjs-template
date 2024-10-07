import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

// Configura las métricas de OpenTelemetry
export function configureOpenTelemetryMetrics() {
  const metricExporter = new OTLPMetricExporter({
    url: process.env.METRIC_EXPORTER_URL || 'http://localhost:4318/v1/metrics',
  });

  const meterProvider = new MeterProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME || 'default-service',
    }),
  });

  // Configurar el lector de métricas con exportación periódica
  const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 60000, // 60 segundos
  });

  meterProvider.addMetricReader(metricReader);

  // Obtener un Meter
  const meter = meterProvider.getMeter('default-meter');

  // Ejemplo: registrar una métrica simple
  const exampleCounter = meter.createCounter('example_counter', {
    description: 'Contador de ejemplo',
  });

  // Incrementar el contador en un intervalo regular
  setInterval(() => {
    exampleCounter.add(1, { pid: process.pid });
    console.log('Metric example_counter incremented');
  }, 10000); // Cada 10 segundos

  console.log('OpenTelemetry metrics configured.');
}
