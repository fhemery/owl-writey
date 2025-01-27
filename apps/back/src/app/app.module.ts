import { Module } from '@nestjs/common';
import { PingModule } from '@owl-writey/ping';

@Module({
  imports: [PingModule],
})
export class AppModule {}
