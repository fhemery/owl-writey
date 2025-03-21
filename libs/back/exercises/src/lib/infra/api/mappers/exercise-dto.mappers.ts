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
  exercise: Exercise,
  links: ExerciseLinksDto,
  userId: string
): ExquisiteCorpseLinksDto {
  const exCorpse = exercise as ExquisiteCorpseExercise;
  return {
    ...links,
    takeTurn: exCorpse.canTakeTurn()
      ? `${baseAppUrl}/api/exquisite-corpse/${exercise.id}/take-turn`
      : undefined,
    cancelTurn: exCorpse.canCancelTurn(userId)
      ? `${baseAppUrl}/api/exquisite-corpse/${exercise.id}/cancel-turn`
      : undefined,
    submitTurn: exCorpse.hasTurn(userId)
      ? `${baseAppUrl}/api/exquisite-corpse/${exercise.id}/submit-turn`
      : undefined,
  };
}

function generateLinks(
  baseAppUrl: string,
  exercise: Exercise,
  userId: string
): ExerciseLinksDto {
  const isAdmin = exercise.isParticipantAdmin(userId);
  let links: ExerciseLinksDto = {
    self: `${baseAppUrl}/api/exercises/${exercise.id}`,
    delete: isAdmin ? `${baseAppUrl}/api/exercises/${exercise.id}` : undefined,
    finish:
      isAdmin && exercise.generalInfo.status === ExerciseStatus.Ongoing
        ? `${baseAppUrl}/api/exercises/${exercise.id}/finish`
        : undefined,
    invite:
      isAdmin && exercise.generalInfo.status === ExerciseStatus.Ongoing
        ? `${baseAppUrl}/api/exercises/${exercise.id}/participants`
        : undefined,
    leave: isAdmin
      ? undefined
      : `${baseAppUrl}/api/exercises/${exercise.id}/participants/me`,
    removeParticipant: isAdmin
      ? `${baseAppUrl}/api/exercises/${exercise.id}/participants/{id}`
      : undefined,
    connect:
      exercise.type === ExerciseType.ExquisiteCorpse
        ? `${baseAppUrl}/api/exercises/${exercise.id}/events`
        : undefined,
  };

  if (exercise.type === ExerciseType.ExquisiteCorpse) {
    links = addExquisiteCorpseLinks(baseAppUrl, exercise, links, userId);
  }
  return links;
}

export function toExerciseDto(
  exercise: Exercise,
  baseAppUrl: string,
  userId: string
): ExerciseDto {
  return {
    id: exercise.id,
    name: exercise.generalInfo.name,
    type: exercise.type,
    config: exercise.config,
    content: exercise.content,
    status: exercise.generalInfo.status,
    participants: exercise.getParticipants().map((p) => ({
      uid: p.uid,
      name: p.name,
      isAdmin: p.role === ExerciseParticipantRole.Admin,
    })),
    _links: generateLinks(baseAppUrl, exercise, userId),
  };
}
