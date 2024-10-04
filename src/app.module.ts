import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggingModule } from './infrastructure/logging/logging.module';
import { HealthModule } from './infrastructure/health/health.module';
import { LoggerMidleware } from './infrastructure/midleware/logger/logger.midleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: parseInt(config.get('THROTTLE_TTL'), 10),
          limit: parseInt(config.get('THROTTLE_LIMIT'), 10), 
          blockDuration: 30000,
          ignoreUserAgents: [],
          skipIf: (context) => {
            return false;
          },
        },
      ],
    }),
    LoggingModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,  // Usamos ThrottlerGuard o tu AppGuard personalizado
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMidleware)
      .forRoutes('*');
  }
}
