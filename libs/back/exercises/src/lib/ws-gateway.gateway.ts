import { OnGatewayConnection, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WsGatewayGateway implements OnGatewayConnection {
  async handleConnection(client: Socket): Promise<void> {
    // Join user-specific room
    // client.join(`user_${client.data.user.userId}`);
    // client.emit('connected', { status: 'authenticated' });

    // Set up dynamic event handling
    client.onAny(async (eventName, payload) => {
      console.log('Received event:', eventName, payload);
      //await this.messageDispatcher.dispatchMessage(eventName, args[0], client);
    });
  }
}
