import {
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
      .build(ExercisesModule);
  });

  afterEach(async () => {
    await app.reset();
  });

  afterAll(async () => {
    await app.close();
  });
};
