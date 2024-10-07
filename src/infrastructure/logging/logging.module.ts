import { Module } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { logger } from './config/logger.config';

@Module({
  providers: [
    {
      provide: 'LoggerService',
      useValue: logger,
    },
    LoggingService,
  ],
  exports: [LoggingService],
})
export class LoggingModule {}
