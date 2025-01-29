import { ExerciseParticipantRole, ExerciseType } from '@owl/shared/contracts';

export class ExerciseFactory {
  static From(
    id: string,
    name: string,
    type: ExerciseType,
    data: unknown
  ): Exercise {
    switch (type) {
      case ExerciseType.ExquisiteCorpse:
        return new ExquisiteCorpseExercise(id, name, data);
      default:
        throw new Error('Unknown exercise type');
    }
  }
}

export abstract class Exercise {
  abstract readonly type: ExerciseType;
  private readonly participants: ExerciseParticipant[] = [];
  constructor(
    readonly id: string,
    readonly name: string,
    readonly data: unknown
  ) {}

  addParticipant(
    uid: string,
    name: string,
    Admin: ExerciseParticipantRole
  ): void {
    this.participants.push(new ExerciseParticipant(uid, name, Admin));
  }

  getParticipants(): ExerciseParticipant[] {
    return [...this.participants];
  }
}

export class ExquisiteCorpseExercise extends Exercise {
  override type = ExerciseType.ExquisiteCorpse;
  constructor(id: string, name: string, data: unknown) {
    super(id, name, data);
  }
}

export class ExerciseParticipant {
  constructor(
    readonly uid: string,
    readonly name: string,
    readonly role: ExerciseParticipantRole
  ) {}
}
