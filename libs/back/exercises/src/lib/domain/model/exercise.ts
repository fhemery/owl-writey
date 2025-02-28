import {
  ExerciseParticipantRole,
  ExerciseStatus,
  ExerciseType,
} from '@owl/shared/contracts';

import { ExerciseException } from './exceptions/exercise-exception';
import { ExerciseGeneralInfo } from './exercise-general-info';

export abstract class Exercise<Config = unknown, Content = unknown> {
  abstract readonly type: ExerciseType;

  constructor(
    readonly id: string,
    public generalInfo: ExerciseGeneralInfo,
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

  finish(userId?: string): void {
    if (userId && !this.generalInfo.isParticipantAdmin(userId)) {
      throw new ExerciseException('You are not an admin');
    }
    this.generalInfo = new ExerciseGeneralInfo(
      this.generalInfo.name,
      ExerciseStatus.Finished,
      this.generalInfo.participants
    );
  }

  protected isFinished(): boolean {
    return this.generalInfo.status === ExerciseStatus.Finished;
  }
}

export class ExerciseParticipant {
  constructor(
    readonly uid: string,
    readonly name: string,
    readonly role: ExerciseParticipantRole
  ) {}
}
