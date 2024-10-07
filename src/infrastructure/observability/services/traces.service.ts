import { Injectable } from '@nestjs/common';
import { trace, Span, SpanKind, SpanOptions } from '@opentelemetry/api';

@Injectable()
export class TracesService {
  private tracer = trace.getTracer('default-tracer');

  startSpan(name: string, options?: SpanOptions): Span {
    const span = this.tracer.startSpan(name, {
      kind: SpanKind.INTERNAL,
      ...options, // Permite opciones adicionales como atributos
    });
    return span;
  }

  endSpan(span: Span, attributes: Record<string, never> = {}) {
    if (span.isRecording()) {
      // Añadir atributos finales al span
      span.setAttributes(attributes);
      span.end(); // Finaliza el span
    }
  }

  // Método para registrar errores en un span
  recordError(span: Span, error: Error) {
    span.recordException(error); // Registra el error en el span
    this.endSpan(span); // Finaliza el span
  }

  // Método para manejar contextos
  withSpan<T>(name: string, fn: () => T): T {
    const span = this.startSpan(name);
    try {
      return fn(); // Ejecuta la función pasada
    } catch (error) {
      this.recordError(span, error);
      throw error; // Lanza el error después de registrarlo
    } finally {
      this.endSpan(span); // Finaliza el span al final
    }
  }
}
