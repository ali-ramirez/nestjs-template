import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';

export function configureTelemetry() {
  const traceExporter = new OTLPTraceExporter({
    url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
  });

  const metricExporter = new OTLPMetricExporter({
    url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/metrics`,
  });

  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'nestjs-app',
    }),
    traceExporter,
    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
      // Otras instrumentaciones
    ],
  });

  // Iniciar SDK para trazas
  sdk.start();

  // Configurar las métricas
  const meterProvider = new MeterProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'nestjs-app',
    }),
  });

  meterProvider.addMetricReader(
    new PeriodicExportingMetricReader({
      exporter: metricExporter,
      exportIntervalMillis: parseInt(process.env.OTEL_EXPORT_INTERVAL, 10) || 60000,
    }),
  );

  return sdk;
}
