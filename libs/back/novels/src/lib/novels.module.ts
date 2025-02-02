import { Module } from '@nestjs/common';
import { UsersModule } from '@owl/back/user';

import { NovelsController } from './infra/api/novels.controller';

@Module({
  imports: [UsersModule],
  controllers: [NovelsController],
  providers: [],
  exports: [],
})
export class NovelsModule {}
