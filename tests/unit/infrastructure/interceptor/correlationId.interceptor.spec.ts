import { describe, it, expect, vi } from 'vitest';
import { FastifyRequest, FastifyReply } from 'fastify';
import { LoggerMidleware } from '@/infrastructure/midleware/logger/logger.midleware';

describe('Some Interceptor', () => {
  it('should log the correlation ID', async () => {
    // Mock del logger
    const loggerMock = { debug: vi.fn(), log: vi.fn(), error: vi.fn() };

    // Instanciamos el middleware con el logger mockeado
    const middleware = new LoggerMidleware(loggerMock as never);

    // Creamos el mock de la request y la respuesta
    const req = {
      method: 'GET',
      url: '/test',
      headers: { 'x-correlation-id': 'test-id' }, // Simulamos un correlationId en los headers
    } as unknown as FastifyRequest;

    // Accedemos a la respuesta cruda (raw) para simular el objeto `ServerResponse`
    const res = {
      setHeader: vi.fn(),
      on: vi.fn(),
      raw: {}, // Simulamos la respuesta Fastify 'raw' aquí
    } as unknown as FastifyReply['raw'];

    // Ejecutamos el middleware
    await middleware.use(req, res, () => {});

    // Verificamos si el logger fue llamado con el correlationId
    expect(loggerMock.debug).toHaveBeenCalledWith(expect.stringContaining('correlationId: '));
  });
});
