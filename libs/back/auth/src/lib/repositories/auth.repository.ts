import { Role } from '@owl/shared/contracts';

import { UserDetails } from '../model';

export const AuthRepository = Symbol('AuthRepository');
export interface AuthRepository {
  getUserFromToken(token: string): Promise<UserDetails>;

  getUserByUid(uid: string): Promise<UserDetails>;

  setRoles(uid: string, roles: Role[]): Promise<void>;

  setVerifiedUser(uid: string): Promise<void>;

  changePassword(uid: string, password: string): Promise<void>;
}
