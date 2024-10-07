import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { trace, SpanKind } from '@opentelemetry/api';

export function configureOpenTelemetryTraces() {
  const traceExporter = new OTLPTraceExporter({
    url: process.env.TRACE_EXPORTER_URL || 'http://localhost:4318/v1/traces',
  });

  const consoleExporter = new ConsoleSpanExporter();

  // Configurar ambos span processors en la configuración inicial del SDK
  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'nestjs-app',
    }),
    // Aquí pasamos los span processors directamente
    spanProcessors: [
      new SimpleSpanProcessor(traceExporter),
      new SimpleSpanProcessor(consoleExporter),
    ],
    instrumentations: [
      // Agrega las instrumentaciones que necesites
    ],
  });

  sdk.start();
  console.log('Tracing SDK started');

  // Crear un span manual para verificar las trazas
  const tracer = trace.getTracer('default-tracer');
  const span = tracer.startSpan('manual_span', {
    kind: SpanKind.INTERNAL,
  });
  console.log('Manual span created');
  span.end();
}
