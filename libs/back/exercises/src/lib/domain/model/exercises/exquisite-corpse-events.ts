import { EmittedEvent } from '@owl/back/infra/events';

import { ExquisiteCorpseExercise } from './exquisite-corpse';

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

export class ExCorpseCancelTurnEvent
  implements EmittedEvent<{ exercise: ExquisiteCorpseExercise }>
{
  static eventName = 'exquisite-corpse.cancel-turn';
  name = ExCorpseCancelTurnEvent.eventName;
  payload: { exercise: ExquisiteCorpseExercise };

  constructor(exercise: ExquisiteCorpseExercise) {
    this.payload = { exercise };
  }
}

export class ExCorpseSubmitTurnEvent
  implements EmittedEvent<{ exercise: ExquisiteCorpseExercise }>
{
  static eventName = 'exquisite-corpse.submit-turn';
  name = ExCorpseSubmitTurnEvent.eventName;
  payload: { exercise: ExquisiteCorpseExercise };

  constructor(exercise: ExquisiteCorpseExercise) {
    this.payload = { exercise };
  }
}
