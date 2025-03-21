import { Module } from '@nestjs/common';
import { UsersModule } from '@owl/back/user';

import { NovelUserFacade } from '../../domain/ports';
import { NovelUserFacadeImpl } from './novel-user-facade.impl';

@Module({
  imports: [UsersModule],
  providers: [{ provide: NovelUserFacade, useClass: NovelUserFacadeImpl }],
  exports: [NovelUserFacade],
})
export class NovelUserModule {}
