import { Injectable } from '@nestjs/common';
import { UsersService } from '@owl/back/user';

import { NovelUser } from '../../domain/model';
import { NovelUserFacade } from '../../domain/ports';

@Injectable()
export class NovelUserFacadeImpl implements NovelUserFacade {
  constructor(readonly usersService: UsersService) {}

  async getOne(userId: string): Promise<NovelUser | null> {
    const user = await this.usersService.get(userId);
    if (!user) {
      return null;
    }
    return new NovelUser(user.uid, user.name);
  }
}
