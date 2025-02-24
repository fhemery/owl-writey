import {
  ExerciseDto,
  ExerciseParticipantRole,
  ExerciseSummaryDto,
} from '@owl/shared/contracts';

import { ExerciseSummary } from '../../../domain/model';
import { Exercise } from '../../../domain/model/exercise';

export function toExerciseSummaryDto(
  exercise: ExerciseSummary
): ExerciseSummaryDto {
  return {
    id: exercise.id,
    name: exercise.name,
    type: exercise.type,
    status: exercise.status,
  };
}

export function toExerciseDto(exercise: Exercise): ExerciseDto {
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
  };
}
