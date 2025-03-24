import { countWordsFromHtml } from '@owl/shared/word-utils';

import { ExerciseException } from '../../exceptions/exercise-exception';
import { ExquisiteCorpseExercise } from '../exquisite-corpse';
export class SubmitTurnPolicy {
  checkSubmit(
    uid: string,
    content: string,
    exercise: ExquisiteCorpseExercise
  ): void {
    if (
      exercise.content?.currentWriter?.author.uid !== uid ||
      (exercise.content.currentWriter?.until &&
        exercise.content.currentWriter.until < new Date())
    ) {
      throw new ExerciseException('It is not your turn');
    }

    if (exercise.isFinished()) {
      throw new ExerciseException('Exercise is finished');
    }

    this.checkContentLength(content, exercise);
  }

  private checkContentLength(
    content: string,
    exercise: ExquisiteCorpseExercise
  ): void {
    if (
      !exercise.config.textSize?.minWords &&
      !exercise.config.textSize?.maxWords
    ) {
      return;
    }
    const nbWords = countWordsFromHtml(content);

    if (
      exercise.config.textSize?.minWords &&
      nbWords < exercise.config.textSize.minWords
    ) {
      throw new ExerciseException('Content is too short');
    }

    if (
      exercise.config.textSize?.maxWords &&
      nbWords > exercise.config.textSize.maxWords
    ) {
      throw new ExerciseException('Content is too long');
    }
  }
}
