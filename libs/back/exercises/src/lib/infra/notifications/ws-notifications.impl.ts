import { Injectable } from '@nestjs/common';
import { WsNotificationService } from '@owl/back/websocket';

import { NotificationFacade } from '../../domain/ports';

@Injectable()
export class WsNotificationsImpl implements NotificationFacade {
  constructor(private readonly wsNotifService: WsNotificationService) {}
  notifyUser<Payload>(
    userId: string,
    event: string,
    payload: Payload
  ): Promise<void> {
    this.wsNotifService.notifyUser(userId, event, payload);
    return Promise.resolve();
  }
  notifyRoom<Payload>(
    roomId: string,
    event: string,
    payload: Payload,
    excludeUserId?: string
  ): Promise<void> {
    this.wsNotifService.notifyRoom(roomId, event, payload, excludeUserId);
    return Promise.resolve();
  }
}
