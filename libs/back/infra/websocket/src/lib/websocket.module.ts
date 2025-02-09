import { Module } from '@nestjs/common';
import { AuthModule } from '@owl/back/auth';

import { WsGateway } from './ws.gateway';
import { WsNotificationService } from './ws-notification.service';

@Module({
  controllers: [],
  imports: [AuthModule],
  providers: [WsGateway, WsNotificationService],
  exports: [WsNotificationService],
})
export class WebsocketModule {}
