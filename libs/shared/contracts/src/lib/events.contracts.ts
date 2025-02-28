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

export class ConnectionToExerciseSuccessfulEvent extends SseEvent {
  static readonly eventName = 'connectionToExerciseSuccessful';
  constructor(exerciseName: string) {
    super(ConnectionToExerciseSuccessfulEvent.eventName, exerciseName);
  }
}
