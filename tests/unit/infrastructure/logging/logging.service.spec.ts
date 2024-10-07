import { logger } from '@/infrastructure/logging/config/logger.config';
import { LoggingService } from '@/infrastructure/logging/logging.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mockear el logger importado desde 'logger.config'
vi.mock('@/infrastructure/logging/config/logger.config', () => ({
  logger: {
    info: vi.fn(),
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    verbose: vi.fn(),
  },
}));

describe('LoggingService', () => {
  let service: LoggingService;

  beforeEach(() => {
    service = new LoggingService();
  });

  afterEach(() => {
    // Limpiar los mocks después de cada test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log info message', () => {
    const message = 'Test info message';
    service.log(message);
    expect(logger.info).toHaveBeenCalledWith(message);
  });

  it('should log fatal message', () => {
    const message = 'Test fatal message';
    service.fatal(message);
    expect(logger.log).toHaveBeenCalledWith('fatal', message);
  });

  it('should log error message with trace', () => {
    const message = 'Test error message';
    const trace = 'Test trace';
    service.error(message, trace);
    expect(logger.error).toHaveBeenCalledWith(message, { trace });
  });

  it('should log warn message', () => {
    const message = 'Test warn message';
    service.warn(message);
    expect(logger.warn).toHaveBeenCalledWith(message);
  });

  it('should log debug message', () => {
    const message = 'Test debug message';
    service.debug(message);
    expect(logger.debug).toHaveBeenCalledWith(message);
  });

  it('should log verbose message', () => {
    const message = 'Test verbose message';
    service.verbose(message);
    expect(logger.verbose).toHaveBeenCalledWith(message);
  });
});
