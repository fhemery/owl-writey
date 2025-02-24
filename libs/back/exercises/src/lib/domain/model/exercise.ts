import { ExerciseParticipantRole, ExerciseType } from '@owl/shared/contracts';

import { ExerciseException } from './exceptions/exercise-exception';
import { ExerciseGeneralInfo } from './exercise-general-info';

export abstract class Exercise<Config = unknown, Content = unknown> {
  abstract readonly type: ExerciseType;

  constructor(
    readonly id: string,
    readonly generalInfo: ExerciseGeneralInfo,
    readonly config: Config,
    public content?: Content
  ) {}

  addParticipant(
    uid: string,
    name: string,
    role: ExerciseParticipantRole
  ): void {
    this.generalInfo.addParticipant(uid, name, role);
  }

  getParticipants(): ExerciseParticipant[] {
    return this.generalInfo.participants;
  }

  removeParticipant(userId: string, participantId: string): void {
    this.generalInfo.removeParticipant(userId, participantId);
  }

  checkDelete(userId: string): void {
    const user = this.generalInfo.participants.find((p) => p.uid === userId);
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
