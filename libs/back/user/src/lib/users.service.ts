import { Injectable } from '@nestjs/common';
import { UserNotFoundException } from '@owl/back/auth';

import { User } from './model/user';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(user: User): Promise<string> {
    await this.userRepository.createUser(user);
    return user.uid;
  }

  async get(id: string): Promise<User | null> {
    return await this.userRepository.getUser(id);
  }

  async delete(uid: string): Promise<void> {
    const user = await this.userRepository.getUser(uid);
    if (!user) {
      throw new UserNotFoundException();
    }
    await this.userRepository.deleteUser(uid);
  }
}
