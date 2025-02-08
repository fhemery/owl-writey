export class ExerciseNotFoundException extends Error {
  constructor(id: string) {
    super(`exercise with id ${id} not found`);
    this.name = 'ExerciseNotFoundException';
  }
}
