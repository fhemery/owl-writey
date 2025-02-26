import { Module } from '@nestjs/common';
import { AuthModule } from '@owl/back/auth';

import { SseNotificationService } from './sse-notification.service';
import { WsGateway } from './ws.gateway';
import { WsNotificationService } from './ws-notification.service';

@Module({
  controllers: [],
  imports: [AuthModule],
  providers: [WsGateway, WsNotificationService, SseNotificationService],
  exports: [WsNotificationService, SseNotificationService],
})
export class WebsocketModule {}
