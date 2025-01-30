import { EventEmitter2 } from '@nestjs/event-emitter';
import { OnGatewayConnection, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { UntypedWsEvent } from './events/ws-events';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WsGatewayGateway implements OnGatewayConnection {
  constructor(private eventEmitter: EventEmitter2) {}

  async handleConnection(client: Socket): Promise<void> {
    // Join user-specific room
    // client.join(`user_${client.data.user.userId}`);
    // client.emit('connected', { status: 'authenticated' });

    // Set up dynamic event handling
    client.onAny(async (eventName, payload) => {
      console.log('Received event:', eventName, payload);
      const eventToDispatch = new UntypedWsEvent(eventName, payload, client);

      this.eventEmitter.emit(eventName, eventToDispatch);
      /*const response: ExquisiteCorpseContentDto = {
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
      };*/
      //client.emit('exCorpse:updates', response); //TODO extract the event name into a constant
      //await this.messageDispatcher.dispatchMessage(eventName, args[0], client);
    });
  }
}
