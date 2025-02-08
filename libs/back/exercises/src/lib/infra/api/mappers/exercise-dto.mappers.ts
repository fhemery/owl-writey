import { ExerciseDto, ExerciseParticipantRole } from '@owl/shared/contracts';

import { Exercise } from '../../../model/exercise';

export function toExerciseDto(exercise: Exercise): ExerciseDto {
  return {
    id: exercise.id,
    name: exercise.name,
    type: exercise.type,
    data: exercise.config,
    participants: exercise.getParticipants().map((p) => ({
      uid: p.uid,
      name: p.name,
      isAdmin: p.role === ExerciseParticipantRole.Admin,
    })),
  };
}
