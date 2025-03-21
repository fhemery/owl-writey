import { ExerciseDto } from './exercise.contracts';

export class SseEvent<T = unknown> {
  constructor(readonly event: string, readonly data: T) {}
}

export class HeartbeatEvent extends SseEvent {
  constructor() {
    super('heartbeat', null);
  }
}

export const connectedToExerciseEvent = 'connectionToExerciseSuccessful';
export const disconnectedFromExerciseEvent = 'disconnectedFromExercise';
export const exquisiteCorpseTurnTakenEvent = 'exerciseTurnTaken';
export const exquisiteCorpseTurnSubmittedEvent = 'exerciseTurnSubmitted';
export const exquisiteCorpseTurnCanceledEvent = 'exerciseTurnCanceled';

export class NotificationEvent extends SseEvent<{
  key: string;
  data: Record<string, unknown>;
  uid?: string;
}> {
  static readonly eventName = 'notification';
  constructor(key: string, data: Record<string, unknown>, uid?: string) {
    super(NotificationEvent.eventName, { key, data, uid });
  }
}

export class ExercisedUpdateEvent extends SseEvent<{ exercise: ExerciseDto }> {
  static readonly eventName = 'exerciseUpdated';
  constructor(exercise: ExerciseDto) {
    super(ExercisedUpdateEvent.eventName, { exercise });
  }
}
