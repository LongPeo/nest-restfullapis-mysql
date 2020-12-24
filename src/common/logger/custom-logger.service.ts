import { LoggerService, Logger } from '@nestjs/common';
import * as winston from 'winston';

export class CustomLogger extends Logger implements LoggerService {
  private winston: any;
  constructor() {
    super();
    const maxFiles = Number(process.env.LOG_MAX_FILE);
    const maxsize = Number(process.env.LOG_MAX_SILE) * 1024 * 1024; // bytes
    this.winston = winston.createLogger({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
      ),
      transports: [
        new winston.transports.File({
          filename: process.env.LOG_PATH_FILE_INFO,
          level: 'info',
          maxFiles,
          maxsize,
        }),
        new winston.transports.File({
          filename: process.env.LOG_PATH_FILE_ERROR,
          level: 'error',
          maxFiles,
          maxsize,
        }),
      ],
    });

    if (process.env.NODE_ENV !== 'prod') {
      this.winston.add(new winston.transports.Console());
    }
  }

  error(message: any) {
    const newMessage =
      typeof message === 'object' ? JSON.stringify(message) : message;
    this.winston.log({ level: 'error', message: newMessage });
  }

  log(message: any) {
    const newMessage =
      typeof message === 'object' ? JSON.stringify(message) : message;
    this.winston.log({ level: 'info', message: newMessage });
  }

  warn(message: any) {
    this.winston.log({ level: 'warn', message });
  }
}
