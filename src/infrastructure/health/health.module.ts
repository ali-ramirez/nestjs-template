import { Module } from '@nestjs/common';
import { HealthController } from './controller/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { LoggingModule } from '../logging/logging.module';
import { ObservabilityModule } from '../observability/observability.module';

@Module({
  imports: [TerminusModule, LoggingModule, ObservabilityModule],
  controllers: [HealthController],
  providers: [],
})
export class HealthModule {}
