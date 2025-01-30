import { OnGatewayConnection, WebSocketGateway } from '@nestjs/websockets';
import { ExquisiteCorpseContentDto } from '@owl/shared/contracts';
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

      const response: ExquisiteCorpseContentDto = {
        scenes: [
          {
            id: 1,
            text: 'Il était une fois...',
            author: {
              id: '1',
              name: 'Alice',
            },
          },
          {
            id: 2,
            text: '... un lapin blanc.',
            author: {
              id: '2',
              name: 'Bob',
            },
          },
        ],
        currentWriter: undefined,
      };
      client.emit('exCorpse:updates', response); //TODO extract the event name into a constant
      //await this.messageDispatcher.dispatchMessage(eventName, args[0], client);
    });
  }
}
