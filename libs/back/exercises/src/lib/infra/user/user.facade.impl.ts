import { Injectable } from '@nestjs/common';
import { UsersService } from '@owl/back/user';

import { ExerciseUser } from '../../domain/model';
import { ExerciseUserFacade } from '../../domain/ports';

@Injectable()
export class UserFacadeImpl implements ExerciseUserFacade {
  constructor(private readonly usersService: UsersService) {}

  async get(userId: string): Promise<ExerciseUser | null> {
    const user = await this.usersService.get(userId);
    if (user) {
      return new ExerciseUser(user.uid, user.name);
    }
    return null;
  }
}
