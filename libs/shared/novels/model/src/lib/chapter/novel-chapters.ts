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
    if (index !== undefined) {
      return new NovelChapters([
        ...this._chapters.slice(0, index),
        new NovelChapter(id, new NovelChapterGeneralInfo(name, outline), []),
        ...this._chapters.slice(index),
      ]);
    } else {
      return new NovelChapters([
        ...this._chapters,
        new NovelChapter(id, new NovelChapterGeneralInfo(name, outline), []),
      ]);
    }
  }

  update(chapter: NovelChapter): NovelChapters {
    const index = this._chapters.findIndex((c) => c.id === chapter.id);
    if (index !== -1) {
      return new NovelChapters([
        ...this._chapters.slice(0, index),
        chapter,
        ...this._chapters.slice(index + 1),
      ]);
    }
    return this;
  }
  move(chapterId: string, atIndex: number): NovelChapters {
    const chapterIndex = this._chapters.findIndex((c) => c.id === chapterId);
    if (chapterIndex === -1) {
      return this;
    }
    const chapter = this._chapters[chapterIndex];
    const otherChapters = this.chapters.filter((c) => c.id !== chapterId);
    if (atIndex > chapterIndex) {
      atIndex--;
    }
    return new NovelChapters([
      ...otherChapters.slice(0, atIndex),
      chapter,
      ...otherChapters.slice(atIndex),
    ]);
  }

  delete(chapterId: string): NovelChapters {
    const index = this._chapters.findIndex((c) => c.id === chapterId);
    if (index !== -1) {
      return new NovelChapters([
        ...this._chapters.slice(0, index),
        ...this._chapters.slice(index + 1),
      ]);
    }
    return this;
  }
  addSceneAt(
    chapterId: string,
    sceneId: string,
    title: string,
    outline = '',
    index?: number
  ): NovelChapters {
    const chapterIndex = this._chapters.findIndex((c) => c.id === chapterId);
    if (chapterIndex === -1) {
      return this;
    }
    return new NovelChapters([
      ...this._chapters.slice(0, chapterIndex),
      this._chapters[chapterIndex].addNewSceneAt(
        sceneId,
        title,
        outline,
        index
      ),
      ...this._chapters.slice(chapterIndex + 1),
    ]);
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
    return new NovelChapters([
      ...this._chapters.map((c) =>
        c.id === initialChapterId
          ? newInitialChapter
          : c.id === targetChapterId
          ? newTargetChapter
          : c
      ),
    ]);
  }
  moveScene(chapterId: string, sceneId: string, at: number): NovelChapters {
    if (!this.findChapter(chapterId)) {
      return this;
    }
    return new NovelChapters([
      ...this._chapters.map((c) =>
        c.id === chapterId ? c.moveScene(sceneId, at) : c
      ),
    ]);
  }

  deleteScene(chapterId: string, sceneId: string): NovelChapters {
    const chapterIndex = this._chapters.findIndex((c) => c.id === chapterId);
    if (chapterIndex === -1) {
      return this;
    }
    return new NovelChapters([
      ...this._chapters.slice(0, chapterIndex),
      this._chapters[chapterIndex].deleteScene(sceneId),
      ...this._chapters.slice(chapterIndex + 1),
    ]);
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
