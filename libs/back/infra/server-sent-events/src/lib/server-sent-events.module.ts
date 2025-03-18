import { Module } from '@nestjs/common';

import { SseNotificationService } from './sse-notification.service';

@Module({
  controllers: [],
  providers: [SseNotificationService],
  exports: [SseNotificationService],
})
export class ServerSentEventsModule {}
