import { Module } from '@nestjs/common';

import { LogsController } from './logs.controller';

@Module({
  controllers: [LogsController],
  providers: [],
  exports: [],
})
export class LogsModule {}
