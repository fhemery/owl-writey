import { NovelException } from '../exceptions/novel.exception';
import { NovelScene } from '../scene/novel-scene';
import { NovelSceneGeneralInfo } from '../scene/novel-scene-general-info';
import { NovelChapterGeneralInfo } from './novel-chapter-general-info';

export class NovelChapter {
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
    if (index !== undefined) {
      return this.withScenes([
        ...this.scenes.slice(0, index),
        new NovelScene(sceneId, new NovelSceneGeneralInfo(title, outline), ''),
        ...this.scenes.slice(index),
      ]);
    } else {
      return this.withScenes([
        ...this.scenes,
        new NovelScene(sceneId, new NovelSceneGeneralInfo(title, outline), ''),
      ]);
    }
  }
  updateTitle(title: string): NovelChapter {
    return this.withGeneralInfo(this.generalInfo.withTitle(title));
  }

  updateOutline(outline: string): NovelChapter {
    return this.withGeneralInfo(this.generalInfo.withOutline(outline));
  }

  addExistingSceneAt(scene: NovelScene, sceneIndex: number): NovelChapter {
    if (sceneIndex !== undefined) {
      return this.withScenes([
        ...this.scenes.slice(0, sceneIndex),
        scene,
        ...this.scenes.slice(sceneIndex),
      ]);
    } else {
      return this.withScenes([...this.scenes, scene]);
    }
  }
  containsScene(sceneId: string): boolean {
    return this.scenes.some((s) => s.id === sceneId);
  }
  deletePov(characterId: string): void {
    this.scenes.forEach((s) => s.deletePov(characterId));
  }
  doMoveScene(sceneId: string, at: number): NovelChapter {
    const sceneIndex = this.scenes.findIndex((s) => s.id === sceneId);
    if (sceneIndex === -1) {
      return this;
    }
    const scene = this.scenes[sceneIndex];
    const otherScenes = this.scenes.filter((s) => s.id !== sceneId);
    if (at > sceneIndex) {
      at--;
    }
    return new NovelChapter(this.id, this.generalInfo, [
      ...otherScenes.slice(0, at),
      scene,
      ...otherScenes.slice(at),
    ]);
  }
  updateScene(scene: NovelScene): NovelChapter {
    const existingScene = this.scenes.find((s) => s.id === scene.id);
    if (!existingScene) {
      return this;
    }
    return this.withScenes(
      this.scenes.map((s) => (s.id === scene.id ? scene : s))
    );
  }
  deleteScene(sceneId: string): NovelChapter {
    const index = this.scenes.findIndex((s) => s.id === sceneId);
    if (index !== -1) {
      return this.withScenes(this.scenes.filter((s) => s.id !== sceneId));
    }
    return this;
  }

  private withGeneralInfo(generalInfo: NovelChapterGeneralInfo): NovelChapter {
    return new NovelChapter(this.id, generalInfo, this.scenes);
  }
  private withScenes(scenes: NovelScene[]): NovelChapter {
    return new NovelChapter(this.id, this.generalInfo, scenes);
  }
}
