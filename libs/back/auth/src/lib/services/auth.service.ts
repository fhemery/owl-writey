import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@owl/shared/contracts';

import { UserDetails } from '../model';
import { AuthRepository } from '../repositories/auth.repository';

interface TokenDetails {
  email: string;
  uid: string;
  roles: Role[];
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(AuthRepository) private readonly repository: AuthRepository
  ) {}

  async getUserByUid(uid: string): Promise<UserDetails> {
    return await this.repository.getUserByUid(uid);
  }

  async authenticate(authToken: string): Promise<TokenDetails> {
    const tokenString = this.getToken(authToken);
    try {
      return this.repository.getUserFromToken(tokenString);
    } catch (err) {
      const error = err as Error;
      this.logger.error(`error while authenticate request ${error.message}`);
      throw new UnauthorizedException(error.message);
    }
  }

  private getToken(authToken: string): string {
    const match = authToken.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
      throw new UnauthorizedException('Invalid token');
    }
    return match[1];
  }

  async setRoles(uid: string, roles: Role[]): Promise<void> {
    await this.repository.setRoles(uid, roles);
  }

  async addRole(uid: string, role: Role): Promise<void> {
    const user = await this.repository.getUserByUid(uid);
    if (!user.roles.includes(role)) {
      user.roles.push(role);
      await this.setRoles(uid, user.roles);
    }
  }

  async removeRole(uid: string, role: Role): Promise<void> {
    const user = await this.repository.getUserByUid(uid);
    if ((user.roles || []).includes(role)) {
      user.roles = user.roles.filter((r) => r !== role);
      await this.setRoles(uid, user.roles);
    }
  }

  async setVerified(uid: string): Promise<void> {
    await this.repository.setVerifiedUser(uid);
  }

  async changePassword(uid: string, password: string): Promise<void> {
    await this.repository.changePassword(uid, password);
  }
}
