import {
  ExerciseDto,
  ExerciseLinksDto,
  ExerciseParticipantRole,
  ExerciseStatus,
  ExerciseSummaryDto,
  ExerciseType,
  ExquisiteCorpseLinksDto,
} from '@owl/shared/contracts';

import {
  ExerciseSummary,
  ExquisiteCorpseExercise,
} from '../../../domain/model';
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

function addExquisiteCorpseLinks(
  baseAppUrl: string,
  exercise: Exercise<unknown, unknown>,
  links: ExerciseLinksDto
): ExquisiteCorpseLinksDto {
  const exCorpse = exercise as ExquisiteCorpseExercise;
  return {
    ...links,
    takeTurn: exCorpse.canTakeTurn()
      ? `${baseAppUrl}/api/exCorpse/${exercise.id}/takeTurn`
      : undefined,
  };
}

function generateLinks(
  baseAppUrl: string,
  exercise: Exercise<unknown, unknown>,
  isUserAdmin: boolean
): ExerciseLinksDto {
  let links: ExerciseLinksDto = {
    self: `${baseAppUrl}/api/exercises/${exercise.id}`,
    delete: isUserAdmin
      ? `${baseAppUrl}/api/exercises/${exercise.id}`
      : undefined,
    finish:
      isUserAdmin && exercise.generalInfo.status === ExerciseStatus.Ongoing
        ? `${baseAppUrl}/api/exercises/${exercise.id}/finish`
        : undefined,
    invite:
      isUserAdmin && exercise.generalInfo.status === ExerciseStatus.Ongoing
        ? `${baseAppUrl}/api/exercises/${exercise.id}/participants`
        : undefined,
    leave: isUserAdmin
      ? undefined
      : `${baseAppUrl}/api/exercises/${exercise.id}/participants/me`,
    removeParticipant: isUserAdmin
      ? `${baseAppUrl}/api/exercises/${exercise.id}/participants/{id}`
      : undefined,
    connect:
      exercise.type === ExerciseType.ExquisiteCorpse
        ? `${baseAppUrl}/api/exercises/${exercise.id}/events`
        : undefined,
  };

  if (exercise.type === ExerciseType.ExquisiteCorpse) {
    links = addExquisiteCorpseLinks(baseAppUrl, exercise, links);
  }
  return links;
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
    _links: generateLinks(baseAppUrl, exercise, isUserAdmin),
  };
}
