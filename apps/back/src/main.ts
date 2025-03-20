/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
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
  app.enableCors({
    origin: process.env['OWL_FRONT_URL'] || 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    exposedHeaders: ['Location'],
  });

  const config = new DocumentBuilder()
    .setTitle('Owl-Writey api')
    .setDescription('Owl-writey available operations')
    .setVersion('1.0')
    .build();
  const documentFactory = (): OpenAPIObject =>
    SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

void bootstrap();
