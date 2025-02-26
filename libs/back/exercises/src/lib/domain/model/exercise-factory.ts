import { ExerciseType } from '@owl/shared/contracts';

import { Exercise } from './exercise';
import { ExerciseGeneralInfo } from './exercise-general-info';
import { ExerciseUser } from './exercise-user';
import {
  ExquisiteCorpseConfig,
  ExquisiteCorpseContent,
  ExquisiteCorpseExercise,
  ExquisiteCorpseNextActor,
  ExquisiteCorpseScene,
} from './exercises/exquisite-corpse';

export class ExerciseFactory {
  static From(
    id: string,
    generalInfo: ExerciseGeneralInfo,
    type: ExerciseType,
    config: unknown,
    content?: unknown
  ): Exercise {
    switch (type) {
      case ExerciseType.ExquisiteCorpse:
        return new ExquisiteCorpseExercise(
          id,
          generalInfo,
          exquisiteCorpseConverter.toConfig(config),
          exquisiteCorpseConverter.toContent(content)
        );
      default:
        throw new Error('Unknown exercise type');
    }
  }
}

const exquisiteCorpseConverter = {
  toConfig(config: unknown): ExquisiteCorpseConfig {
    const cfg = config as ExquisiteCorpseConfig;
    return new ExquisiteCorpseConfig(cfg.initialText, cfg.nbIterations);
  },

  toContent(content: unknown): ExquisiteCorpseContent | undefined {
    if (!content) {
      return undefined;
    }
    const cont = content as ExquisiteCorpseContent;
    return new ExquisiteCorpseContent(
      cont.scenes.map((scene) => {
        return new ExquisiteCorpseScene(
          scene.id,
          scene.text,
          new ExerciseUser(scene.author.uid, scene.author.name)
        );
      }),
      cont.currentWriter
        ? new ExquisiteCorpseNextActor(
            new ExerciseUser(
              cont.currentWriter.author.uid,
              cont.currentWriter.author.name
            ),
            cont.currentWriter.until
          )
        : undefined
    );
  },
};
