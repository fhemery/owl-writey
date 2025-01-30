import { ExerciseParticipantRole, ExerciseType } from '@owl/shared/contracts';

export abstract class Exercise<Config = unknown, Content = unknown> {
  abstract readonly type: ExerciseType;
  constructor(
    readonly id: string,
    readonly name: string,
    readonly participants: ExerciseParticipant[],
    readonly config: Config,
    public content?: Content
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

export class ExquisiteCorpseExercise extends Exercise<
  ExquisiteCorpseConfig,
  ExquisiteCorpseContent
> {
  override type = ExerciseType.ExquisiteCorpse;
  constructor(
    id: string,
    name: string,
    participants: ExerciseParticipant[],
    config: ExquisiteCorpseConfig,
    content?: ExquisiteCorpseContent
  ) {
    super(id, name, participants, config, content);
    if (!content) {
      this.content = this.initContent();
    }
  }
  initContent(): ExquisiteCorpseContent {
    if (!this.participants.length) {
      throw new Error('Exercise should have at least one participant');
    }
    const firstParticipant = this.participants[0];
    const firstScene = new ExquisiteCorpseScene(
      1,
      this.config.initialText,
      new Author(firstParticipant.uid, firstParticipant.name)
    );
    return new ExquisiteCorpseContent([firstScene], undefined);
  }

  setTurn(author: Author): void {
    const inFifteenMinutes = new Date();
    inFifteenMinutes.setMinutes(inFifteenMinutes.getMinutes() + 15);

    if (!this.content) {
      throw new Error('Exercise content is not initialized'); // TODO : Throw a business error (or better, ensure it is initialized)
    }
    this.content.currentWriter = new ExquisiteCorpseNextActor(
      author,
      inFifteenMinutes
    );
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
    public currentWriter?: ExquisiteCorpseNextActor
  ) {}
}

export class ExquisiteCorpseConfig {
  constructor(readonly nbIterations: number, readonly initialText: string) {
    if (nbIterations < 1) {
      throw new Error('nbIterations must be at least 1');
    }
    if (initialText.length === 0) {
      throw new Error('initialText must not be empty');
    }
  }
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
