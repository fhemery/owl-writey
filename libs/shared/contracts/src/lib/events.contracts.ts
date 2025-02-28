import { ExerciseDto } from './exercise.contracts';

export class SseEvent<T = unknown> {
  constructor(readonly event: string, readonly data: T) {}
}

export class ConnectToExerciseEvent extends SseEvent<{
  author: string;
  exerciseName: string;
}> {
  static readonly eventName = 'connectedToExercise';
  constructor(author: string, exerciseName: string) {
    super(ConnectToExerciseEvent.eventName, { author, exerciseName });
  }
}

export interface ExerciseEventData<NotificationData = Record<string, unknown>> {
  notification?: {
    key: string;
    data: NotificationData;
  };
  exercise?: ExerciseDto;
}
export class ExerciseUpdatedEvent<
  NotificationData = Record<string, unknown>
> extends SseEvent<ExerciseEventData<NotificationData>> {
  static readonly eventName = 'exerciseUpdated';
  constructor(
    exercise?: ExerciseDto,
    notification?: { key: string; data: NotificationData }
  ) {
    super(ExerciseUpdatedEvent.eventName, { exercise, notification });
  }
}

export class ConnectionToExerciseSuccessfulEvent extends ExerciseUpdatedEvent<{
  name: string;
}> {
  static readonly translationKey = 'connectionToExerciseSuccessful';
  constructor(exercise: ExerciseDto) {
    super(exercise, {
      key: ConnectionToExerciseSuccessfulEvent.translationKey,
      data: { name: exercise.name },
    });
  }
}
