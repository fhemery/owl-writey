import {
  exerciseErrors,
  ExerciseParticipantRole,
  ExerciseType,
} from '@owl/shared/contracts';

import { ExerciseException } from './exceptions/exercise-exception';

export abstract class Exercise<Config = unknown, Content = unknown> {
  abstract readonly type: ExerciseType;
  constructor(
    readonly id: string,
    readonly name: string,
    public participants: ExerciseParticipant[],
    readonly config: Config,
    public content?: Content
  ) {}

  addParticipant(
    uid: string,
    name: string,
    role: ExerciseParticipantRole
  ): void {
    if (this.participants.some((p) => p.uid === uid)) {
      throw new ExerciseException('Participant already exists');
    }
    this.participants.push(new ExerciseParticipant(uid, name, role));
  }

  getParticipants(): ExerciseParticipant[] {
    return [...this.participants];
  }

  removeParticipant(userId: string, participantId: string): void {
    const participant = this.participants.find((p) => p.uid === participantId);
    if (!participant) {
      return;
    }

    if (userId !== participantId) {
      const user = this.participants.find((p) => p.uid === userId);
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
    this.participants = this.participants.filter(
      (p) => p.uid !== participantId
    );
  }

  checkDelete(userId: string): void {
    const user = this.participants.find((p) => p.uid === userId);
    if (!user || user.role !== ExerciseParticipantRole.Admin) {
      throw new ExerciseException('You are not an admin');
    }
  }
}

export class ExerciseParticipant {
  constructor(
    readonly uid: string,
    readonly name: string,
    readonly role: ExerciseParticipantRole
  ) {}
}
