import { AuthService, TokenDetails, UserDetails } from '@owl/back/auth';
import { ResettableMock } from '@owl/back/test-utils';
import { Role } from '@owl/shared/contracts';

type AuthServiceInterface = Pick<AuthService, keyof AuthService>;

export class AuthServiceMock implements ResettableMock, AuthServiceInterface {
  users: UserDetails[] = [];
  addUser(user: UserDetails): Promise<void> {
    this.users.push(user);
    return Promise.resolve();
  }
  getUserByUid(uid: string): Promise<UserDetails> {
    const user = this.users.find((u) => u.uid === uid);
    if (!user) {
      throw new Error(`User not found, ${uid}`);
    }
    return Promise.resolve(user);
  }
  authenticate(authToken: string): Promise<TokenDetails> {
    console.log(authToken);
    throw new Error('Method not implemented.');
  }
  async setRoles(uid: string, roles: Role[]): Promise<void> {
    const user = await this.getUserByUid(uid);
    user.roles = roles;
    return Promise.resolve();
  }
  async removeRole(uid: string, role: Role): Promise<void> {
    const user = await this.getUserByUid(uid);
    user.roles = user.roles.filter((r) => r !== role);
    return Promise.resolve();
  }
  async setVerified(uid: string): Promise<void> {
    const user = await this.getUserByUid(uid);
    user.isEmailVerified = true;
    return Promise.resolve();
  }
  async changePassword(uid: string, password: string): Promise<void> {
    console.log(uid, password);
    throw new Error('Method not implemented.');
  }
  async addRole(uid: string, role: Role): Promise<void> {
    const user = await this.getUserByUid(uid);
    user.roles.push(role);
  }
  delete(uid: string): Promise<void> {
    this.users = this.users.filter((u) => u.uid !== uid);
    return Promise.resolve();
  }
  reset(): Promise<void> {
    this.users = [];
    return Promise.resolve();
  }
}
