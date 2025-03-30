import { SseEvent } from '@owl/shared/common/contracts';

import { ExerciseDto } from './exercise.contracts';

export const connectedToExerciseEvent = 'connectionToExerciseSuccessful';
export const disconnectedFromExerciseEvent = 'disconnectedFromExercise';
export const exquisiteCorpseTurnTakenEvent = 'exerciseTurnTaken';
export const exquisiteCorpseTurnSubmittedEvent = 'exerciseTurnSubmitted';
export const exquisiteCorpseTurnCanceledEvent = 'exerciseTurnCanceled';

export class ExercisedUpdateEvent extends SseEvent<{ exercise: ExerciseDto }> {
  static readonly eventName = 'exerciseUpdated';
  constructor(exercise: ExerciseDto) {
    super(ExercisedUpdateEvent.eventName, { exercise });
  }
}
