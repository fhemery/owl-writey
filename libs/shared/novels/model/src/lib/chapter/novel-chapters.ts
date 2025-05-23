import { arrayUtils } from '@owl/shared/common/utils';

import { NovelScene } from '../scene/novel-scene';
import { NovelChapter } from './novel-chapter';
import { NovelChapterGeneralInfo } from './novel-chapter-general-info';

export class NovelChapters {
  private _chapters: NovelChapter[];
  constructor(chapters: NovelChapter[] = []) {
    this._chapters = chapters;
  }

  get chapters(): NovelChapter[] {
    return [...this._chapters];
  }

  addAt(id: string, name: string, outline = '', index?: number): NovelChapters {
    return new NovelChapters(
      arrayUtils.insertAt(
        this._chapters,
        new NovelChapter(id, new NovelChapterGeneralInfo(name, outline), []),
        index
      )
    );
  }

  update(chapter: NovelChapter): NovelChapters {
    return new NovelChapters(arrayUtils.replaceItem(this._chapters, chapter));
  }

  move(chapterId: string, atIndex: number): NovelChapters {
    return new NovelChapters(
      arrayUtils.moveItem(this._chapters, chapterId, atIndex)
    );
  }

  delete(chapterId: string): NovelChapters {
    return new NovelChapters(arrayUtils.removeItem(this._chapters, chapterId));
  }

  addSceneAt(
    chapterId: string,
    sceneId: string,
    title: string,
    outline = '',
    index?: number
  ): NovelChapters {
    return new NovelChapters(
      this._chapters.map((c) =>
        c.id === chapterId ? c.addNewSceneAt(sceneId, title, outline, index) : c
      )
    );
  }
  updateScene(chapterId: string, scene: NovelScene): NovelChapters {
    return new NovelChapters(
      this._chapters.map((c) => (c.id === chapterId ? c.updateScene(scene) : c))
    );
  }

  transferScene(
    initialChapterId: string,
    sceneId: string,
    targetChapterId: string,
    sceneIndex: number
  ): NovelChapters {
    const initialChapter = this.findChapter(initialChapterId);
    const targetChapter = this.findChapter(targetChapterId);
    const scene = initialChapter?.scenes.find((s) => s.id === sceneId);
    if (!initialChapter || !targetChapter || !scene) {
      return this;
    }
    const newInitialChapter = initialChapter.deleteScene(sceneId);
    const newTargetChapter = targetChapter.addExistingSceneAt(
      scene,
      sceneIndex
    );
    return new NovelChapters(
      this._chapters.map((c) =>
        c.id === initialChapterId
          ? newInitialChapter
          : c.id === targetChapterId
          ? newTargetChapter
          : c
      )
    );
  }
  moveScene(chapterId: string, sceneId: string, at: number): NovelChapters {
    return new NovelChapters(
      this._chapters.map((c) =>
        c.id === chapterId ? c.moveScene(sceneId, at) : c
      )
    );
  }

  deleteScene(chapterId: string, sceneId: string): NovelChapters {
    return new NovelChapters(
      this._chapters.map((c) =>
        c.id === chapterId ? c.deleteScene(sceneId) : c
      )
    );
  }
  removePov(id: string): NovelChapters {
    return new NovelChapters(this._chapters.map((c) => c.removePov(id)));
  }
  copy(): NovelChapters {
    return new NovelChapters([...this._chapters]);
  }

  findChapter(chapterId: string): NovelChapter | null {
    return this._chapters.find((c) => c.id === chapterId) || null;
  }

  findScene(chapterId: string, sceneId: string): NovelScene | null {
    return (
      this.findChapter(chapterId)?.scenes.find((s) => s.id === sceneId) || null
    );
  }
}
