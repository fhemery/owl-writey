import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from '@owl/shared/contracts';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';

export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async createUser(user: UserDto): Promise<void> {
    await this.userRepository.save(UserEntity.From(user));
  }

  async getUser(id: string): Promise<UserDto | null> {
    const userEntity = await this.userRepository.findOneBy({ uid: id });
    if (!userEntity) {
      return null;
    }
    return {
      uid: userEntity.uid,
      email: userEntity.email,
      name: userEntity.name,
    };
  }
}
