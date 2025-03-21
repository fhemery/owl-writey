import {
  exerciseErrors,
  ExerciseParticipantRole,
  ExerciseStatus,
} from '@owl/shared/contracts';

import { ExerciseException } from './exceptions/exercise-exception';
import { ExerciseParticipant } from './exercise';

export class ExerciseGeneralInfo {
  #allParticipants: ExerciseParticipant[];

  get participants(): ExerciseParticipant[] {
    return [...this.#allParticipants];
  }

  constructor(
    readonly name: string,
    readonly status: ExerciseStatus,
    participants: ExerciseParticipant[]
  ) {
    this.#allParticipants = participants;
  }

  addParticipant(
    uid: string,
    name: string,
    role: ExerciseParticipantRole
  ): void {
    if (this.status === ExerciseStatus.Finished) {
      throw new ExerciseException('Exercise is finished');
    }
    if (this.#allParticipants.some((p) => p.uid === uid)) {
      throw new ExerciseException('Participant already exists');
    }
    this.#allParticipants.push(new ExerciseParticipant(uid, name, role));
  }

  removeParticipant(userId: string, participantId: string): void {
    const participant = this.#allParticipants.find(
      (p) => p.uid === participantId
    );
    if (!participant) {
      return;
    }

    if (userId !== participantId) {
      const user = this.#allParticipants.find((p) => p.uid === userId);
      if (!user || user.role !== ExerciseParticipantRole.Admin) {
        throw new ExerciseException('You are not an admin');
      }
    }

    if (
      participant.role === ExerciseParticipantRole.Admin &&
      this.participants.filter((p) => p.role === ExerciseParticipantRole.Admin)
        .length === 1
    ) {
      throw new ExerciseException(exerciseErrors.removeLastAdmin);
    }
    this.#allParticipants = this.#allParticipants.filter(
      (p) => p.uid !== participantId
    );
  }
  isParticipantAdmin(userId: string): boolean {
    return this.#allParticipants.some(
      (p) => p.uid === userId && p.role === ExerciseParticipantRole.Admin
    );
  }
  findParticipant(uid: string): ExerciseParticipant | undefined {
    return this.#allParticipants.find((p) => p.uid === uid);
  }
}
