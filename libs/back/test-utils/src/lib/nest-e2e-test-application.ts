import { App } from 'supertest/types';

import { NestTestApplication } from './nest-test-application';

export class NestE2eTestApplication extends NestTestApplication {
  async reset(): Promise<void> {
    return Promise.resolve();
  }

  async close(): Promise<void> {
    return Promise.resolve();
  }

  protected getRequestTarget(): App | string {
    return 'http://localhost:3000';
  }
}
