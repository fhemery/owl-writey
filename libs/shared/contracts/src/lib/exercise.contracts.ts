export interface GetAllExercisesResponseDto {
  exercises: ExerciseSummaryDto[];
}

export interface ExerciseSummaryDto {
  id: string;
  name: string;
  type: ExerciseType;
  status: ExerciseStatus;
  links: {
    self: string;
  };
}

export interface ExerciseDto {
  id: string;
  name: string;
  type: ExerciseType;
  status: ExerciseStatus;
  config: unknown;
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
  config: unknown;
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

export enum ExerciseStatus {
  Ongoing = 'Ongoing',
  Finished = 'Finished',
  Archived = 'Archived',
}
