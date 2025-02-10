import { ExerciseType } from '@owl/shared/contracts';

import { ExerciseException } from '../exceptions/exercise-exception';
import { Exercise, ExerciseParticipant } from '../exercise';
import { ExerciseUser } from '../exercise-user';

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
      new ExerciseUser(firstParticipant.uid, firstParticipant.name)
    );
    return new ExquisiteCorpseContent([firstScene], undefined);
  }

  setTurn(author: ExerciseUser): void {
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
    if (this.content?.currentWriter?.author.uid !== userId) {
      throw new ExerciseException('It is not your turn, you cannot cancel');
    }
    this.content.currentWriter = undefined;
  }
  submitTurn(uid: string, content: string): void {
    if (
      this.content?.currentWriter?.author.uid !== uid ||
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
    readonly author: ExerciseUser
  ) {}
}
export class ExquisiteCorpseNextActor {
  constructor(readonly author: ExerciseUser, readonly until: Date) {}
}
