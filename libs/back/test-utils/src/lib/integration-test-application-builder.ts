import {
  DynamicModule,
  INestApplication,
  InjectionToken,
  Type,
  ValidationPipe,
  ValueProvider,
} from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import { FakeAuthMiddleware } from './internal/fake-auth-middleware.service';
import { ResettableMock } from './model/resettable-mock';
import { NestIntegrationTestApplication } from './nest-integration-test-application';

export class IntegrationTestApplicationBuilder {
  private _app: INestApplication | null = null;
  private _providers: ValueProvider[] = [];
  private _mocks: ResettableMock[] = [];
  private _useInMemoryDb = false;
  private _portNumber?: number;

  constructor() {
    this.withEnvVariable('POSTHOG_ENABLED', '0');
    this.withEnvVariable('DATADOG_ENABLED', '0');
  }

  async build(module: Type): Promise<NestIntegrationTestApplication> {
    let builder = Test.createTestingModule({
      imports: this._useInMemoryDb
        ? [this.generateDbConfig(), EventEmitterModule.forRoot(), module]
        : [EventEmitterModule.forRoot(), module],
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
    if (this._portNumber) {
      await this._app.listen(this._portNumber);
    }

    return new NestIntegrationTestApplication(this._app, this._mocks);
  }

  generateDbConfig(): DynamicModule {
    return TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: ':memory:',
      synchronize: true,
      dropSchema: true,
      autoLoadEntities: true,
      entities: [],
      logging: ['error'],
    });
  }

  withFakeInMemoryDb(): IntegrationTestApplicationBuilder {
    this._useInMemoryDb = true;
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

  withPortExposition(
    port: number | undefined
  ): IntegrationTestApplicationBuilder {
    this._portNumber = port;
    return this;
  }
}
