import { EmittedEvent } from '@owl/back/infra/events';

import { ExerciseUser } from '../exercise-user';
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
  implements
    EmittedEvent<{
      exercise: ExquisiteCorpseExercise;
      lastAuthor: ExerciseUser;
    }>
{
  static eventName = 'exquisite-corpse.cancel-turn';
  name = ExCorpseCancelTurnEvent.eventName;
  payload: { exercise: ExquisiteCorpseExercise; lastAuthor: ExerciseUser };

  constructor(exercise: ExquisiteCorpseExercise, author: ExerciseUser) {
    this.payload = { exercise, lastAuthor: author };
  }
}

export class ExCorpseSubmitTurnEvent
  implements EmittedEvent<{ exercise: ExquisiteCorpseExercise }>
{
  static eventName = 'exquisite-corpse.submit-turn';
  name = ExCorpseSubmitTurnEvent.eventName;
  payload: { exercise: ExquisiteCorpseExercise; author: ExerciseUser };

  constructor(exercise: ExquisiteCorpseExercise, author: ExerciseUser) {
    this.payload = { exercise, author };
  }
}
