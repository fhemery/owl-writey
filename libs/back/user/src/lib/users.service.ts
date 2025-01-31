import { Injectable } from '@nestjs/common';

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
}
