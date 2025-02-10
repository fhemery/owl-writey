import { ExerciseType } from '@owl/shared/contracts';

import { Exercise, ExerciseParticipant } from './exercise';
import { ExerciseUser } from './exercise-user';
import { ExquisiteCorpseNextActor } from './exercises/exquisite-corpse';
import { ExquisiteCorpseScene } from './exercises/exquisite-corpse';
import { ExquisiteCorpseConfig } from './exercises/exquisite-corpse';
import { ExquisiteCorpseContent } from './exercises/exquisite-corpse';
import { ExquisiteCorpseExercise } from './exercises/exquisite-corpse';

export class ExerciseFactory {
  static From(
    id: string,
    name: string,
    type: ExerciseType,
    config: unknown,
    participants: ExerciseParticipant[],
    content?: unknown
  ): Exercise {
    switch (type) {
      case ExerciseType.ExquisiteCorpse:
        return new ExquisiteCorpseExercise(
          id,
          name,
          participants,
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
    return new ExquisiteCorpseConfig(cfg.nbIterations, cfg.initialText);
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
