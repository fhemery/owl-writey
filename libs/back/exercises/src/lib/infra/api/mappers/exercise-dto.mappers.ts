import {
  ExerciseDto,
  ExerciseParticipantRole,
  ExerciseSummaryDto,
} from '@owl/shared/contracts';

import { ExerciseSummary } from '../../../domain/model';
import { Exercise } from '../../../domain/model/exercise';

export function toExerciseSummaryDto(
  exercise: ExerciseSummary,
  baseAppUrl: string
): ExerciseSummaryDto {
  return {
    id: exercise.id,
    name: exercise.name,
    type: exercise.type,
    status: exercise.status,
    _links: {
      self: `${baseAppUrl}/api/exercises/${exercise.id}`,
    },
  };
}

export function toExerciseDto(
  exercise: Exercise,
  baseAppUrl: string,
  userId: string
): ExerciseDto {
  const isUserAdmin = exercise
    .getParticipants()
    .some((p) => p.uid === userId && p.role === ExerciseParticipantRole.Admin);
  return {
    id: exercise.id,
    name: exercise.generalInfo.name,
    type: exercise.type,
    config: exercise.config,
    status: exercise.generalInfo.status,
    participants: exercise.getParticipants().map((p) => ({
      uid: p.uid,
      name: p.name,
      isAdmin: p.role === ExerciseParticipantRole.Admin,
    })),
    _links: {
      self: `${baseAppUrl}/api/exercises/${exercise.id}`,
      delete: isUserAdmin
        ? `${baseAppUrl}/api/exercises/${exercise.id}`
        : undefined,
      finish: isUserAdmin
        ? `${baseAppUrl}/api/exercises/${exercise.id}/finish`
        : undefined,
      invite: isUserAdmin
        ? `${baseAppUrl}/api/exercises/${exercise.id}/participants`
        : undefined,
      leave: isUserAdmin
        ? undefined
        : `${baseAppUrl}/api/exercises/${exercise.id}/participants/me`,
    },
  };
}
