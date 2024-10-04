import { LoggingService } from '@/infrastructure/logging/logging.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FastifyRequest, FastifyReply } from 'fastify'; 

type NextFunction = (err?: Error) => void;
export const CORRELATION_ID_HEADER='X-Correlation-Id'
@Injectable()
export class LoggerMidleware implements NestMiddleware {
  constructor(private readonly logger: LoggingService) {}

  async use(req: FastifyRequest, res: FastifyReply['raw'], next: NextFunction): Promise<void> {
    const correlationId = randomUUID();
    req.headers[CORRELATION_ID_HEADER] = correlationId;
    // Medir la duración de la solicitud
    const start = Date.now();

    this.logger.debug(`Incoming request: ${req.method} ${req.url} with correlationId: ${correlationId}`);

    res.setHeader(CORRELATION_ID_HEADER, correlationId); // Añadir el CORRELATION_ID_HEADER en la respuesta

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.log(`Request completed: ${req.method} ${req.url} in ${duration}ms with correlationId: ${correlationId}`);
    });

    // Manejar errores
    res.on('error', (err) => {
      this.logger.error(`Error processing request: ${req.method} ${req.url}`, err.message);
    });

    next(); 
  }
}
