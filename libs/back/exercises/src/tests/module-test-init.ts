import { WsAuthService } from '@owl/back/auth';
import {
  FakeWsAuthService,
  IntegrationTestApplicationBuilder,
  NestTestApplication,
} from '@owl/back/test-utils';

import { ExercisesModule } from '../lib/exercises.module';

export let app: NestTestApplication;

export const moduleTestInit = async (port?: number): Promise<void> => {
  beforeAll(async () => {
    app = await new IntegrationTestApplicationBuilder()
      .withFakeInMemoryDb()
      .withPortExposition(port)
      .withMock(WsAuthService, new FakeWsAuthService())
      .build(ExercisesModule);
  });

  afterEach(async () => {
    await app.reset();
  });

  afterAll(async () => {
    await app.close();
  });
};
