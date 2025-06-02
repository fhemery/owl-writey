import { EmittedEvent } from '@owl/back/infra/events';

import { ExerciseUser } from '../exercise-user';
import { ExquisiteCorpseExercise } from './exquisite-corpse';

export class ExCorpseTakeTurnEvent
  implements EmittedEvent<{ exercise: ExquisiteCorpseExercise }>
{
  static EventName = 'exquisite-corpse.take-turn';
  name = ExCorpseTakeTurnEvent.EventName;
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
      cancelingUserId: string;
    }>
{
  static EventName = 'exquisite-corpse.cancel-turn';
  name = ExCorpseCancelTurnEvent.EventName;
  payload: {
    exercise: ExquisiteCorpseExercise;
    lastAuthor: ExerciseUser;
    cancelingUserId: string;
  };

  constructor(
    exercise: ExquisiteCorpseExercise,
    author: ExerciseUser,
    cancelingUserId: string
  ) {
    this.payload = { exercise, lastAuthor: author, cancelingUserId };
  }
}

export class ExCorpseSubmitTurnEvent
  implements EmittedEvent<{ exercise: ExquisiteCorpseExercise }>
{
  static EventName = 'exquisite-corpse.submit-turn';
  name = ExCorpseSubmitTurnEvent.EventName;
  payload: { exercise: ExquisiteCorpseExercise; author: ExerciseUser };

  constructor(exercise: ExquisiteCorpseExercise, author: ExerciseUser) {
    this.payload = { exercise, author };
  }
}
