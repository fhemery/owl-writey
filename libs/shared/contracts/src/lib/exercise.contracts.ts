export interface GetAllExercisesResponseDto {
  exercises: ExerciseSummaryDto[];
}

export interface ExerciseSummaryDto {
  id: string;
  name: string;
  type: ExerciseType;
}

export interface ExerciseDto {
  id: string;
  name: string;
  type: ExerciseType;
  data: unknown; // TODO: Can we change this to config?
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
  data: unknown; // TODO : Change this to config
}

export enum ExerciseParticipantRole {
  Admin = 'Admin',
  Participant = 'Participant',
}

export enum ExerciseType {
  ExquisiteCorpse = 'ExquisiteCorpse',
}

export interface AuthorDto {
  uid: string;
  name: string;
}

export const exerciseErrors = {
  removeLastAdmin: 'Cannot remove the last admin of an exercise',
};
