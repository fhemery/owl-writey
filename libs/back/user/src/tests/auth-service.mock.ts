import { ResettableMock } from '@owl/back/test-utils';
import { Role } from '@owl/shared/contracts';

export class AuthServiceMock implements ResettableMock {
  _addRoleArgs: { uid: string; role: Role }[] = [];
  addRole(uid: string, role: Role): Promise<void> {
    this._addRoleArgs.push({ uid, role });
    return Promise.resolve();
  }
  reset(): Promise<void> {
    this._addRoleArgs = [];
    return Promise.resolve();
  }
}
