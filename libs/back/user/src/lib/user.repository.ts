import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './model/user';
import { UserEntity } from './user.entity';

export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async createUser(user: User): Promise<void> {
    await this.userRepository.save(UserEntity.From(user));
  }

  async getUser(id: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOneBy({ uid: id });
    if (!userEntity) {
      return null;
    }
    return new User(userEntity.uid, userEntity.email, userEntity.name);
  }

  async deleteUser(uid: string): Promise<void> {
    await this.userRepository.delete({ uid });
  }
}
