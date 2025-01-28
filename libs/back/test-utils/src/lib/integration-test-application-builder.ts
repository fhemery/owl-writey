import {
  INestApplication,
  InjectionToken,
  Type,
  ValidationPipe,
  ValueProvider,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Role } from '@owl/shared/contracts';

import { FakeAuthMiddleware } from './fake-auth-middleware.service';
import { ResettableMock } from './model/resettable-mock';
import { NestIntegrationTestApplication } from './nest-integration-test-application';
import { NestTestApplication } from './nest-test-application';

export class IntegrationTestApplicationBuilder {
  private _app: INestApplication | null = null;
  private _providers: ValueProvider[] = [];
  private _mocks: ResettableMock[] = [];

  async build(module: Type): Promise<NestTestApplication> {
    let builder = Test.createTestingModule({
      imports: [module],
    });

    this._providers.forEach((p) => {
      builder = builder.overrideProvider(p.provide).useValue(p.useValue);
    });
    const moduleRef = await builder.compile();

    this._app = moduleRef.createNestApplication();
    this._app.setGlobalPrefix('api');
    this._app.useGlobalPipes(new ValidationPipe());
    this._app.use(new FakeAuthMiddleware().use);
    await this._app.init();

    return new NestIntegrationTestApplication(this._app, this._mocks);
  }

  withUser(
    uid: string,
    roles = [Role.User],
    isEmailVerified = true
  ): IntegrationTestApplicationBuilder {
    FakeAuthMiddleware.SetUser(uid, roles, isEmailVerified);
    return this;
  }

  withMock<T extends ResettableMock>(
    type: InjectionToken,
    instance: T
  ): IntegrationTestApplicationBuilder {
    this._providers.push({
      provide: type,
      useValue: instance,
    });
    this._mocks.push(instance);
    return this;
  }

  withTypeOrmMock(
    type: EntityClassOrSchema
  ): IntegrationTestApplicationBuilder {
    this._providers.push({
      provide: getRepositoryToken(type),
      useValue: {},
    });
    return this;
  }

  withEnvVariable(
    key: string,
    value: string
  ): IntegrationTestApplicationBuilder {
    process.env[key] = value;
    return this;
  }
}
