import {
  IntegrationTestApplicationBuilder,
  NestTestApplication,
} from '@owl/back/test-utils';

import { ExercisesModule } from '../lib/exercises.module';

export let app: NestTestApplication;

export const moduleTestInit = async (): Promise<void> => {
  beforeAll(async () => {
    app = await new IntegrationTestApplicationBuilder()
      .withFakeInMemoryDb()
      .build(ExercisesModule);
  });

  afterEach(async () => {
    await app.reset();
  });

  afterAll(async () => {
    await app.close();
  });
};
