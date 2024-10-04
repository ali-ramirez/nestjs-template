import { describe, it, expect, vi } from 'vitest';
import { FastifyRequest, FastifyReply } from 'fastify';
import { LoggerMidleware } from '@/infrastructure/midleware/logger/logger.midleware';

describe('Logger Middleware', () => {
  it('should log the correlation ID', async () => {
    // Mock del logger
    const loggerMock = { debug: vi.fn(), log: vi.fn(), error: vi.fn() };

    // Instanciamos el middleware con el logger mockeado
    const middleware = new LoggerMidleware(loggerMock as any);

    // Creamos el mock de la request y la respuesta
    const req = {
      method: 'GET',
      url: '/test',
      headers: {}, // Sin el correlationId, ya que el middleware lo genera
    } as unknown as FastifyRequest;

    // Accedemos a la respuesta cruda (raw) para simular el objeto `ServerResponse`
    const res = {
      setHeader: vi.fn(),
      on: vi.fn(),
      raw: {} // Simulamos la respuesta Fastify 'raw' aquí
    } as unknown as FastifyReply['raw'];

    // Ejecutamos el middleware
    await middleware.use(req, res, () => {});

    // Verificamos si el logger fue llamado con un correlationId válido (UUID)
    expect(loggerMock.debug).toHaveBeenCalledWith(expect.stringContaining('correlationId: '));

    // Verificamos si la respuesta fue configurada con un header de correlationId
    expect(res.setHeader).toHaveBeenCalledWith(expect.any(String), expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)); // Verifica que sea un UUID válido
  });
});
