import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WsAuthService } from '@owl/back/auth';
import { Server, Socket } from 'socket.io';

import { UntypedWsEvent, WsSession, WsUser } from './model';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly wsAuthService: WsAuthService
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    const token = client.handshake.auth['token'];
    let userDetails: WsSession;
    try {
      const user = await this.wsAuthService.authenticate(token);
      userDetails = new WsSession(new WsUser(user.uid), client, this.server);
    } catch (e) {
      console.error('Failed to authenticate user:', e);
      client.disconnect();
      return;
    }

    await client.join('user-' + userDetails.user.uid);

    // Set up dynamic event handling
    client.onAny(async (eventName, payload) => {
      const eventToDispatch = new UntypedWsEvent(
        eventName,
        payload,
        userDetails
      );

      this.eventEmitter.emit(eventName, eventToDispatch);
    });
  }
}
