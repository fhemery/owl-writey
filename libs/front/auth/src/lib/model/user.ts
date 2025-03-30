import { Role } from '@owl/shared/common/contracts';

export class User {
  constructor(
    readonly uid: string,
    readonly email: string,
    readonly roles: Role[]
  ) {}

  isBetaUser(): boolean {
    return this.roles.includes(Role.Beta);
  }

  isAdmin(): boolean {
    return this.roles.includes(Role.Admin);
  }
}
