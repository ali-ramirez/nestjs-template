import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '@/infrastructure/health/controller/health.controller';

import { LoggingService } from '@/infrastructure/logging/logging.service'; // Asegúrate de importar el servicio real
import { CorrelationIdInterceptor } from '@/infrastructure/interceptor/correlationId.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { describe, it, expect, vi } from 'vitest';
import { HealthCheckService } from '@nestjs/terminus';

describe('HealthController', () => {
  let healthController: HealthController;
  let healthCheckServiceMock: any;
  let loggingServiceMock: any;

  beforeEach(async () => {
    // Crear mocks de los servicios
    healthCheckServiceMock = {
      check: vi.fn().mockResolvedValue({ status: 'ok' }),
    };

    loggingServiceMock = {
      log: vi.fn(),
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
});
