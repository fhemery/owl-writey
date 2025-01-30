import { ExerciseParticipantRole, ExerciseType } from '@owl/shared/contracts';

export class ExerciseFactory {
  static From(
    id: string,
    name: string,
    type: ExerciseType,
    config: unknown,
    content?: unknown
  ): Exercise {
    // TODO : We need this to be an abstract factory to build the objects properly...
    switch (type) {
      case ExerciseType.ExquisiteCorpse:
        return new ExquisiteCorpseExercise(
          id,
          name,
          config as ExquisiteCorpseConfig,
          content as ExquisiteCorpseContent
        );
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
    readonly config: unknown,
    readonly content: unknown
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
  constructor(
    id: string,
    name: string,
    config: ExquisiteCorpseConfig,
    content?: ExquisiteCorpseContent
  ) {
    if (!content) {
      const firstScene = new ExquisiteCorpseScene(
        1,
        config.initialText,
        new Author('a', 'Anonymous')
      ); // TODO : We need to find a way to pass the author (we do not have it...)
      content = new ExquisiteCorpseContent([firstScene], undefined);
    }
    super(id, name, config, content);
  }
}

export class ExerciseParticipant {
  constructor(
    readonly uid: string,
    readonly name: string,
    readonly role: ExerciseParticipantRole
  ) {}
}

export class ExquisiteCorpseContent {
  constructor(
    readonly scenes: ExquisiteCorpseScene[],
    readonly currentWriter?: ExquisiteCorpseNextActor
  ) {}
}

export class ExquisiteCorpseConfig {
  constructor(readonly nbIterations: number, readonly initialText: string) {}
}

export class ExquisiteCorpseScene {
  constructor(
    readonly id: number,
    readonly text: string,
    readonly author: Author
  ) {}
}

export class Author {
  constructor(readonly id: string, readonly name: string) {}
}

export class ExquisiteCorpseNextActor {
  constructor(readonly author: Author, readonly until: Date) {}
}
