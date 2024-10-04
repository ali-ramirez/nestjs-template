import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingService } from './infrastructure/logging/logging.service';
import { CorrelationIdInterceptor } from './infrastructure/interceptor/correlationId.interceptor';
import { fastifyHelmet } from '@fastify/helmet'
import { ThrottlerExceptionFilter } from './infrastructure/filter/throttler-exception.filter';

async function bootstrap() {
  
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
    { bufferLogs: false },
  );

  app.setGlobalPrefix('api');
  // Habilitar CORS con configuraciones básicas
  app.enableCors({
    origin: ['*'],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT', '3000');

  // Usar Winston para logging
  const loggingService = app.get(LoggingService);
  app.useLogger(loggingService);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new CorrelationIdInterceptor());
  app.useGlobalFilters(new ThrottlerExceptionFilter());

  // Añadir Helmet para seguridad de cabeceras HTTP
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: false,
  });

  await app.listen(port, '0.0.0.0');
  console.log(`App is ready and listening on port ${port} 🚀`);
}

bootstrap().catch(handleError);

function handleError(error: unknown) {
  // eslint-disable-next-line no-console
  console.error(error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}

process.on('uncaughtException', handleError);



