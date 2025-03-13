import { EmittedEvent } from '@owl/back/websocket';

import { ExquisiteCorpseExercise } from './exquisite-corpse';

export class TakeTurnPayload {
  constructor(readonly exercise: ExquisiteCorpseExercise) {}
}
export class ExCorpseTakeTurnEvent
  implements EmittedEvent<{ exercise: ExquisiteCorpseExercise }>
{
  static eventName = 'exquisite-corpse.take-turn';
  name = ExCorpseTakeTurnEvent.eventName;
  payload: { exercise: ExquisiteCorpseExercise };

  constructor(exercise: ExquisiteCorpseExercise) {
    this.payload = { exercise };
  }
}
