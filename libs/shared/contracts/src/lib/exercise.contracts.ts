export interface GetAllExercisesResponseDto {
  exercises: ExerciseSummaryDto[];
}

export interface ExerciseSummaryDto {
  id: string;
  name: string;
  type: ExerciseType;
  status: ExerciseStatus;
  _links: {
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
  _links: {
    self: string;
    delete?: string;
    finish?: string;
    invite?: string;
    leave?: string;
    removeParticipant?: string;
  };
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
