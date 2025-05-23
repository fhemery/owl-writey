import { Role } from '@owl/shared/common/contracts';

export class TestUserToRegister {
  constructor(
    readonly email: string,
    readonly password: string,
    readonly name: string
  ) {}
}

export class RegisteredTestUser {
  constructor(
    readonly uid: string,
    readonly email: string,
    readonly password: string,
    readonly name: string,
    readonly roles: Role[] = []
  ) {}
}

export class TestUserBuilder {
  static Random(): TestUserToRegister {
    const name = `test-${Math.random()}`;
    return new TestUserToRegister(`${name}@test.com`, 'password', name);
  }

  static Alice(): RegisteredTestUser {
    return new RegisteredTestUser(
      'alice-uid',
      'alice@test.com',
      'password',
      'Alice'
    );
  }

  static Bob(): RegisteredTestUser {
    return new RegisteredTestUser('bob-uid', 'bob@test.com', 'password', 'Bob');
  }
  static Carol(): RegisteredTestUser {
    return new RegisteredTestUser(
      'carol-uid',
      'carol@test.com',
      'password',
      'Carol'
    );
  }

  static Admin(): RegisteredTestUser {
    return new RegisteredTestUser(
      'admin-uid',
      'admin@test.com',
      'password',
      'Admin',
      [Role.Admin]
    );
  }

  static Beta(): RegisteredTestUser {
    return new RegisteredTestUser(
      'beta-uid',
      'beta@test.com',
      'password',
      'Beta',
      [Role.Beta]
    );
  }
}
