import { Module } from '@nestjs/common';
import { HealthController } from './controller/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [TerminusModule, LoggingModule],
  controllers: [HealthController],
  providers: [],
})
export class HealthModule {}
