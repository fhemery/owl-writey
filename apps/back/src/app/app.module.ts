import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PingModule } from '@owl-writey/ping';

import { ConnectionData } from './utils/datasource';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...ConnectionData, autoLoadEntities: true }),
    PingModule,
  ],
})
export class AppModule {}
