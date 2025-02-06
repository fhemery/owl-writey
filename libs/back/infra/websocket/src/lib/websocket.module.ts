import { Module } from '@nestjs/common';
import { AuthModule } from '@owl/back/auth';

import { WsGateway } from './ws.gateway';

@Module({
  controllers: [],
  imports: [AuthModule],
  providers: [WsGateway],
  exports: [WsGateway],
})
export class WebsocketModule {}
