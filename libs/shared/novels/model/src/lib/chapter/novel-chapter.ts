import { arrayUtils } from '@owl/shared/common/utils';

import { NovelException } from '../exceptions/novel.exception';
import { NovelScene } from '../scene/novel-scene';
import { NovelSceneGeneralInfo } from '../scene/novel-scene-general-info';
import { NovelChapterGeneralInfo } from './novel-chapter-general-info';

export class NovelChapter {
  get nbWords(): number {
    return this.scenes.reduce((acc, scene) => acc + scene.nbWords, 0);
  }
  removePov(id: string): NovelChapter {
    return this.withScenes(this.scenes.map((s) => s.removePov(id)));
  }
  constructor(
    readonly id: string,
    readonly generalInfo: NovelChapterGeneralInfo,
    readonly scenes: NovelScene[] = []
  ) {
    if (!id) {
      throw new NovelException('Id of chapter must be provided');
    }
  }

  addNewSceneAt(
    sceneId: string,
    title: string,
    outline: string,
    index: number | undefined
  ): NovelChapter {
    return this.withScenes(
      arrayUtils.insertAt(
        this.scenes,
        new NovelScene(sceneId, new NovelSceneGeneralInfo(title, outline), ''),
        index
      )
    );
  }
  updateTitle(title: string): NovelChapter {
    return this.withGeneralInfo(this.generalInfo.withTitle(title));
  }

  updateOutline(outline: string): NovelChapter {
    return this.withGeneralInfo(this.generalInfo.withOutline(outline));
  }

  addExistingSceneAt(scene: NovelScene, sceneIndex: number): NovelChapter {
    return this.withScenes(arrayUtils.insertAt(this.scenes, scene, sceneIndex));
  }
  containsScene(sceneId: string): boolean {
    return this.scenes.some((s) => s.id === sceneId);
  }
  moveScene(sceneId: string, at: number): NovelChapter {
    return this.withScenes(arrayUtils.moveItem(this.scenes, sceneId, at));
  }
  updateScene(scene: NovelScene): NovelChapter {
    return this.withScenes(arrayUtils.replaceItem(this.scenes, scene));
  }
  deleteScene(sceneId: string): NovelChapter {
    return this.withScenes(arrayUtils.removeItem(this.scenes, sceneId));
  }

  private withGeneralInfo(generalInfo: NovelChapterGeneralInfo): NovelChapter {
    return new NovelChapter(this.id, generalInfo, this.scenes);
  }
  private withScenes(scenes: NovelScene[]): NovelChapter {
    return new NovelChapter(this.id, this.generalInfo, scenes);
  }

  findScene(sceneId: string): NovelScene | null {
    return this.scenes.find((s) => s.id === sceneId) || null;
  }
}
