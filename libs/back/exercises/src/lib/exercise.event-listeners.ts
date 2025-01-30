import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { WsEvent } from './events/ws-events';
import { ExerciseRepository } from './exercise.repository';

class ExquisiteCorpseConnectionEvent extends WsEvent<{ id: string }> {}

@Injectable()
export class ExerciseEventListeners {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  @OnEvent('exCorpse:connect')
  async handleExquisiteCorpseConnection(
    event: ExquisiteCorpseConnectionEvent
  ): Promise<void> {
    console.log('Received event:', event.name);
    const exercise = await this.exerciseRepository.get(event.payload.id, {
      includeContent: true,
    });

    event.socket.emit('exCorpse:updates', exercise?.content);

    // handle and process "OrderCreatedEvent" event
  }
}
