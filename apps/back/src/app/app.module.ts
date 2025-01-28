import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware, AuthModule } from '@owl/back/auth';
import { PingModule } from '@owl/back/ping';
import { UsersModule } from '@owl/back/user';

import { ConnectionData } from './utils/datasource';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({ ...ConnectionData, autoLoadEntities: true }),
    PingModule,
    UsersModule,
  ],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
