import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { FastifyRequest } from 'fastify'; 
import { logger } from '../logging/config/logger.config';


@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const correlationId = request.headers['X-Correlation-Id'] as string;

    // Añadir el correlationId a los logs globales
    if (correlationId) {
      logger.defaultMeta = { correlationId };
    }

    return next.handle().pipe(
      tap(() => {
        // Cualquier otra lógica que desees realizar tras la respuesta
      }),
    );
  }
}
