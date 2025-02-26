/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';

import { AppModule } from './app/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: 'info',
      exitOnError: false,
      transports: [
        new transports.Console({
          format: format.cli({ colors: { info: 'blue', error: 'red' } }),
        }),
        new transports.File({
          dirname: process.env['OWL_LOG_PATH'] || './',
          filename: 'owl-writey-back.log',
          level: 'info',
          format: format.simple(),
          maxsize: 5 * 1024 * 1024,
        }),
      ],
    }),
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

void bootstrap();
