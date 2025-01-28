import { UserDto } from '@owl/shared/contracts';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user_profiles' })
export class UserEntity {
  @PrimaryColumn('varchar', { length: 36 })
  uid!: string;

  @Column('varchar')
  email!: string;

  @Column('varchar')
  name!: string;

  static From(user: UserDto): UserEntity {
    const entity = new UserEntity();
    entity.uid = user.uid;
    entity.email = user.email || '';
    entity.name = user.name;
    return entity;
  }
}
