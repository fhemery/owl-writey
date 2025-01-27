import { Module } from '@nestjs/common';
import { PingModule } from '@owl-writey/ping';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [PingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
