import { Injectable } from '@nestjs/common';
import { UserDetails } from '@owl/back/auth';

import { ResettableMock } from './model';

@Injectable()
export class FakeWsAuthService implements ResettableMock {
  async authenticate(authToken: string): Promise<UserDetails> {
    return Promise.resolve({
      email: `${authToken}@mail.com`,
      uid: authToken,
      roles: [],
      isEmailVerified: true,
    });
  }

  reset(): Promise<void> {
    return Promise.resolve();
  }
}
