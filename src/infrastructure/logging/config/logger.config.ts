import { join } from 'path';
import { promises as fs } from 'fs';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Directorio para los logs
const logDirectory = join(process.cwd(), 'logs');

// Función para crear la carpeta de logs si no existe
async function createLogDirectory() {
  try {
    await fs.access(logDirectory);
    console.log('Directorio de logs ya existe:', logDirectory);
  } catch {
    console.log('Directorio de logs no existe, creando:', logDirectory);
    await fs.mkdir(logDirectory, { recursive: true });
    console.log('Directorio de logs creado:', logDirectory);
  }
}

// Asegurarse de que la carpeta de logs exista
await createLogDirectory().catch(err => {
  console.error('Error creando la carpeta de logs:', err);
});

// Crear logger con Winston
export const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'my-service-name' },
  transports: [
    new DailyRotateFile({
      filename: join(logDirectory, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.printf((info) => {
          // Estructura personalizada para los logs
          return JSON.stringify({
            timestamp: info.timestamp,
            level: info.level,
            correlationId: info.correlationId,
            method: info.method,
            path: info.path,
            ip: info.ip,
            message: info.message,
            stack: info.stack || null, // Stack trace si es error
          });
        })
      ),
    }),
    new DailyRotateFile({
      filename: join(logDirectory, 'error-%DATE%.log'), // Solo errores
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
      format: format.combine(
        format.timestamp(),
        format.printf((info) => {
          // Estructura personalizada para logs de error
          return JSON.stringify({
            timestamp: info.timestamp,
            level: info.level,
            correlationId: info.correlationId,
            method: info.method,
            path: info.path,
            ip: info.ip,
            message: info.message,
            stack: info.stack,
          });
        })
      ),
    }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level}: ${message}`;
        }),
        format.errors({ stack: true })
      ),
    }),
  ],
});