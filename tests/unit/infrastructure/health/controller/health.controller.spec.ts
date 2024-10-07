import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '@/infrastructure/health/controller/health.controller';

import { LoggingService } from '@/infrastructure/logging/logging.service';
import { CorrelationIdInterceptor } from '@/infrastructure/interceptor/correlationId.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { describe, it, expect, vi } from 'vitest';
import { HealthCheckService } from '@nestjs/terminus';
import { MetricsService } from '@/infrastructure/observability/services/metrics.service';
import { TracesService } from '@/infrastructure/observability/services/traces.service';

describe('HealthController', () => {
  let healthController: HealthController;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let healthCheckServiceMock: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let loggingServiceMock: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let metricsServiceMock: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tracingServiceMock: any;

  beforeEach(async () => {
    // Crear mocks de los servicios
    healthCheckServiceMock = {
      check: vi.fn().mockResolvedValue({ status: 'ok' }),
    };

    loggingServiceMock = {
      log: vi.fn(),
    };

    metricsServiceMock = {
      incrementCounter: vi.fn(),
    };

    tracingServiceMock = {
      withSpan: vi.fn((name, callback) => callback()), // Simular el método withSpan
    };

    // Crear un módulo de prueba
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: healthCheckServiceMock,
        },
        {
          provide: LoggingService,
          useValue: loggingServiceMock,
        },
        {
          provide: MetricsService,
          useValue: metricsServiceMock,
        },
        {
          provide: TracesService,
          useValue: tracingServiceMock,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: CorrelationIdInterceptor,
        },
      ],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
  });

  it('debería registrar el mensaje de "Health check requested"', async () => {
    await healthController.checkHealth();

    // Verificar si el logging se llamó
    expect(loggingServiceMock.log).toHaveBeenCalledWith('Health check requested');
  });

  it('debería devolver el estado de salud', async () => {
    const result = await healthController.checkHealth();

    // Verificar el resultado del check de salud
    expect(result).toEqual({ status: 'ok' });
  });

  it('debería lanzar un error si falla el health check', async () => {
    // Simular un error en el health check
    healthCheckServiceMock.check = vi.fn().mockRejectedValue(new Error('Health check failed'));

    await expect(healthController.checkHealth()).rejects.toThrow('Health check failed');
  });

  it('debería incrementar el contador de métricas al solicitar el health check', async () => {
    await healthController.checkHealth();

    // Verificar que se haya llamado al método de incrementar contador
    expect(metricsServiceMock.incrementCounter).toHaveBeenCalledWith('health_check_requests');
  });

  it('debería ejecutar el callback dentro del span al realizar el health check', async () => {
    await healthController.checkHealth();

    // Verificar que se haya llamado al método withSpan
    expect(tracingServiceMock.withSpan).toHaveBeenCalledWith('checkHealth', expect.any(Function));
  });
});
