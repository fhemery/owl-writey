import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { exquisiteCorpseEvents } from '@owl/shared/contracts';

import { WsEvent } from './events/ws-events';
import { ExerciseRepository } from './exercise.repository';

class ExquisiteCorpseConnectionEvent extends WsEvent<{ id: string }> {}

@Injectable()
export class ExerciseEventListeners {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  @OnEvent(exquisiteCorpseEvents.connect)
  async handleExquisiteCorpseConnection(
    event: ExquisiteCorpseConnectionEvent
  ): Promise<void> {
    const exercise = await this.exerciseRepository.get(event.payload.id, {
      includeContent: true,
    });

    event.userDetails.socket.emit(
      exquisiteCorpseEvents.updates,
      exercise?.content
    );
  }
}
