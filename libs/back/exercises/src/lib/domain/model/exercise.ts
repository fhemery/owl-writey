import {
  exerciseErrors,
  ExerciseParticipantRole,
  ExerciseType,
} from '@owl/shared/contracts';

import { ExerciseException } from './exercise-exception';

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
      throw new ExerciseException('Exercise content is not initialized');
    }
    this.content.currentWriter = new ExquisiteCorpseNextActor(
      author,
      inFifteenMinutes
    );
  }
  cancelTurn(userId: string): void {
    if (this.content?.currentWriter?.author.id !== userId) {
      throw new ExerciseException('It is not your turn, you cannot cancel');
    }
    this.content.currentWriter = undefined;
  }
  submitTurn(uid: string, content: string): void {
    if (
      this.content?.currentWriter?.author.id !== uid ||
      this.content.currentWriter.until < new Date()
    ) {
      throw new Error('It is not your turn');
    }

    const nextSceneId = this.content.scenes.length + 1;
    const nextScene = new ExquisiteCorpseScene(
      nextSceneId,
      content,
      this.content.currentWriter.author
    );
    this.content.scenes.push(nextScene);
    this.content.currentWriter = undefined;
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
