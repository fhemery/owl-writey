export interface GetAllExercisesResponseDto {
  exercises: ExerciseDto[];
}

export interface ExerciseDto {
  id: string;
  name: string;
  type: ExerciseType;
  data: unknown;
  participants: ExerciseParticipantDto[];
}

export interface ExerciseParticipantDto {
  uid: string;
  name: string;
  isAdmin: boolean;
}

export interface ExerciseToCreateDto {
  name: string;
  type: ExerciseType;
  data: unknown;
}

export enum ExerciseParticipantRole {
  Admin = 'Admin',
  Participant = 'Participant',
}

export enum ExerciseType {
  ExquisiteCorpse = 'ExquisiteCorpse',
}
