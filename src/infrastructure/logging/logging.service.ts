import { Injectable } from '@nestjs/common';
import { logger } from './config/logger.config';

@Injectable()
export class LoggingService {
  log(message: string) {
    logger.info(message); // Log de nivel 'info'
  }

  fatal(message: string) {
    logger.log('fatal', message); // Log de nivel 'fatal'
  }

  error(message: string, trace?: string) {
    logger.error(message, { trace }); // Log de nivel 'error' con traza
  }

  warn(message: string) {
    logger.warn(message); // Log de nivel 'warn'
  }

  debug(message: string) {
    logger.debug(message); // Log de nivel 'debug'
  }

  verbose(message: string) {
    logger.verbose(message); // Log de nivel 'verbose'
  }
}

