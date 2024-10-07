import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class CustomConfigService {
  constructor(private configService: ConfigService) {}

  get loggerLevel(): string {
    return this.configService.get<string>('LOGGER_LEVEL') || 'info';
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV') || 'development';
  }
}
