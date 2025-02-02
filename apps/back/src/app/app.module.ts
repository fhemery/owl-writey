import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware, AuthModule } from '@owl/back/auth';
import { ExercisesModule } from '@owl/back/exercises';
import { NovelsModule } from '@owl/back/novels';
import { PingModule } from '@owl/back/ping';
import { UsersModule } from '@owl/back/user';
import * as admin from 'firebase-admin';

import { ConnectionData } from './utils/datasource';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({ ...ConnectionData, autoLoadEntities: true }),
    EventEmitterModule.forRoot(),
    PingModule,
    UsersModule,
    ExercisesModule,
    NovelsModule,
  ],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    admin.initializeApp({
      credential: admin.credential.cert({
        private_key: process.env.OWL_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.OWL_FIREBASE_CLIENT_EMAIL,
        project_id: process.env.OWL_FIREBASE_PROJECT_ID,
      } as Partial<admin.ServiceAccount>),
    });
  }
}
