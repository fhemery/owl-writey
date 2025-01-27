import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';

import { ResettableMock } from './model/resettable-mock';
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
    await Promise.all(this._mocks.map((m) => m.reset()));
  }

  async close(): Promise<void> {
    await this._app?.close();
  }

  protected getRequestTarget(): App | string {
    return this._httpServer as App;
  }
}
