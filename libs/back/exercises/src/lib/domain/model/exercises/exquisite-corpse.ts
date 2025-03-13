import { ExerciseStatus, ExerciseType } from '@owl/shared/contracts';

import { ExerciseException } from '../exceptions/exercise-exception';
import { Exercise } from '../exercise';
import { ExerciseGeneralInfo } from '../exercise-general-info';
import { ExerciseUser } from '../exercise-user';

export class ExquisiteCorpseExercise extends Exercise<
  ExquisiteCorpseConfig,
  ExquisiteCorpseContent
> {
  override type = ExerciseType.ExquisiteCorpse;
  constructor(
    id: string,
    generalInfo: ExerciseGeneralInfo,
    config: ExquisiteCorpseConfig,
    content?: ExquisiteCorpseContent
  ) {
    super(id, generalInfo, config, content);
    if (!content) {
      this.content = this.initContent();
    }
  }
  initContent(): ExquisiteCorpseContent {
    const participants = this.generalInfo.participants;
    if (!participants.length) {
      throw new Error('Exercise should have at least one participant');
    }
    const firstParticipant = participants[0];
    const firstScene = new ExquisiteCorpseScene(
      1,
      this.config.initialText,
      new ExerciseUser(firstParticipant.uid, firstParticipant.name)
    );
    return new ExquisiteCorpseContent([firstScene], undefined);
  }

  setTurn(author: ExerciseUser): void {
    if (this.generalInfo.status !== ExerciseStatus.Ongoing) {
      throw new ExerciseException('Exercise is finished');
    }

    if (!this.isTurnAvailable()) {
      throw new ExerciseException('It is not your turn');
    }

    if (!this.content) {
      throw new ExerciseException('Exercise content is not initialized');
    }

    const inFifteenMinutes = new Date();
    inFifteenMinutes.setMinutes(inFifteenMinutes.getMinutes() + 15);
    this.content.currentWriter = new ExquisiteCorpseNextActor(
      author,
      inFifteenMinutes
    );
  }

  private isTurnAvailable(): boolean {
    if (!this.content?.currentWriter) {
      return true;
    }
    return this.content.currentWriter.until.getTime() < new Date().getTime();
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

    if (this.isFinished()) {
      throw new Error('Exercise is finished');
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

  canTakeTurn(): boolean {
    return !this.content?.currentWriter && !this.isFinished();
  }

  hasTurn(userId: string): boolean {
    return (
      this.content?.currentWriter?.author?.uid === userId &&
      this.content?.currentWriter?.until > new Date() &&
      !this.isFinished()
    );
  }
}
export class ExquisiteCorpseContent {
  constructor(
    readonly scenes: ExquisiteCorpseScene[],
    public currentWriter?: ExquisiteCorpseNextActor
  ) {}
}
export class ExquisiteCorpseConfig {
  constructor(
    readonly initialText: string,
    readonly nbIterations: number | null = null
  ) {
    if (nbIterations && nbIterations < 1) {
      throw new ExerciseException(
        'Exquisite corpse: if provided, config.nbIterations must be at least 1'
      );
    }
    if (!initialText || initialText.length === 0) {
      throw new ExerciseException(
        'Exquisite corpse: config.initialText must not be empty'
      );
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
