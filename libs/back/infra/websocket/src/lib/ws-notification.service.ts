import { Injectable } from '@nestjs/common';

import { WsGateway } from './ws.gateway';

@Injectable()
export class WsNotificationService {
  constructor(private readonly wsGateway: WsGateway) {}

  notifyUser<Payload>(userId: string, event: string, payload: Payload): void {
    this.wsGateway.server.to('user-' + userId).emit(event, payload);
  }

  notifyRoom<Payload>(
    roomId: string,
    event: string,
    payload: Payload,
    excludeUserId?: string
  ): void {
    if (excludeUserId) {
      this.wsGateway.server
        .to(roomId)
        .except('user-' + excludeUserId)
        .emit(event, payload);
    } else {
      this.wsGateway.server.to(roomId).emit(event, payload);
    }
  }
}
