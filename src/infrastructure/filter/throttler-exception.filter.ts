import { ExceptionFilter, Catch, ArgumentsHost, Injectable, Logger } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { FastifyReply } from 'fastify'; // Asegúrate de importar FastifyReply

@Injectable()
@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ThrottlerExceptionFilter.name);
  constructor() {}

  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: FastifyReply = ctx.getResponse();
    const status = exception.getStatus();

    // Registrar el evento
    this.logger.warn(`Rate limit exceeded: ${exception.message}`, {
      statusCode: status,
      timestamp: new Date().toISOString(),
    });

    response.status(status).send({
      statusCode: status,
      message: 'Has excedido el límite de peticiones. Por favor, inténtalo de nuevo más tarde.',
      error: 'Rate Limit Exceeded',
    });
  }
}
