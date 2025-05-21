import { v4 as uuidV4 } from 'uuid';

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
    title: string,
    outline: string,
    index: number | undefined
  ): void {
    if (index !== undefined) {
      this.scenes.splice(
        index,
        0,
        new NovelScene(uuidV4(), new NovelSceneGeneralInfo(title, outline), '')
      );
    } else {
      this.scenes.push(
        new NovelScene(uuidV4(), new NovelSceneGeneralInfo(title, outline), '')
      );
    }
  }
  updateTitle(title: string): NovelChapter {
    return this.withGeneralInfo(this.generalInfo.withTitle(title));
  }

  addExistingSceneAt(scene: NovelScene, sceneIndex: number): void {
    if (sceneIndex !== undefined) {
      this.scenes.splice(sceneIndex, 0, scene);
    } else {
      this.scenes.push(scene);
    }
  }
  containsScene(sceneId: string): boolean {
    return this.scenes.some((s) => s.id === sceneId);
  }
  deletePov(characterId: string): void {
    this.scenes.forEach((s) => s.deletePov(characterId));
  }
  moveScene(sceneIndex: number, toIndex: number): void {
    const scene = this.scenes[sceneIndex];
    this.scenes.splice(sceneIndex, 1);
    this.scenes.splice(toIndex, 0, scene);
  }
  updateScene(scene: NovelScene): void {
    const index = this.scenes.findIndex((s) => s.id === scene.id);
    if (index !== -1) {
      this.scenes.splice(index, 1, scene);
    }
  }
  deleteScene(sceneId: string): void {
    const index = this.scenes.findIndex((s) => s.id === sceneId);
    if (index !== -1) {
      this.scenes.splice(index, 1);
    }
  }

  private withGeneralInfo(generalInfo: NovelChapterGeneralInfo): NovelChapter {
    return new NovelChapter(this.id, generalInfo, this.scenes);
  }
}
