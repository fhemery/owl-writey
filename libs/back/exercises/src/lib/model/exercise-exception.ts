export class ExerciseException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExerciseException';
  }
}
