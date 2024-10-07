import { Injectable } from '@nestjs/common';
import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

@Injectable()
export class MetricsService {
  private meterProvider: MeterProvider;

  constructor() {
    this.meterProvider = new MeterProvider({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME || 'default-service',
      }),
    });
  }

  private getMeter() {
    return this.meterProvider.getMeter('default-meter');
  }

  incrementCounter(name: string, attributes: Record<string, never> = {}) {
    const meter = this.getMeter();
    const counter = meter.createCounter(name, {
      description: `Contador para ${name}`,
    });
    counter.add(1, attributes);
  }

  registerGauge(name: string, description: string, getter: () => number) {
    const meter = this.getMeter();
    const observableGauge = meter.createObservableGauge(name, {
      description,
    });

    // Aquí registramos el callback que se ejecutará para obtener el valor
    observableGauge.addCallback((observableGauge) => {
      observableGauge.observe(getter());
    });
  }

  // Método para registrar un histograma
  createHistogram(name: string, description: string) {
    const meter = this.getMeter();
    return meter.createHistogram(name, {
      description,
    });
  }

  recordHistogram(name: string, value: number, attributes: Record<string, never> = {}) {
    const histogram = this.createHistogram(name, `Histograma para ${name}`);
    histogram.record(value, attributes);
  }
}
