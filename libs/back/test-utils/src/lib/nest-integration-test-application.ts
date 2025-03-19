import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';

import { FakeAuthMiddleware } from './internal/fake-auth-middleware.service';
import { ResettableMock } from './model/resettable-mock';
import { RegisteredTestUser } from './model/test-user';
import { NestTestApplication } from './nest-test-application';

export class NestIntegrationTestApplication extends NestTestApplication {
  private readonly _httpServer: unknown;

  constructor(
    private readonly _app: INestApplication,
    private _mocks: ResettableMock[]
  ) {
    super();
    this._httpServer = _app.getHttpServer();
  }

  async reset(): Promise<void> {
    FakeAuthMiddleware.Reset();
    await Promise.all(this._mocks.map((m) => m.reset()));
  }

  async close(): Promise<void> {
    await this._app?.close();
  }

  protected getRequestTarget(): App | string {
    return this._httpServer as App;
  }

  override logAs(user: RegisteredTestUser | null): Promise<void> {
    if (!user) {
      FakeAuthMiddleware.Reset();
      return Promise.resolve();
    }
    FakeAuthMiddleware.SetUser(user.uid, user.email, user.roles);
    return Promise.resolve();
  }
}
