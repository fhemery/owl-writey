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
  updateScene(chapterId: string, scene: NovelScene): void {
    const chapter = this.findChapter(chapterId);
    chapter?.updateScene(scene);
  }

  transferScene(
    initialChapterId: string,
    sceneId: string,
    targetChapterId: string,
    sceneIndex: number
  ): void {
    const initialChapter = this.findChapter(initialChapterId);
    const targetChapter = this.findChapter(targetChapterId);
    const scene = initialChapter?.scenes.find((s) => s.id === sceneId);
    if (!scene) {
      return;
    }
    initialChapter?.deleteScene(sceneId);
    targetChapter?.addExistingSceneAt(scene, sceneIndex);
  }
  moveScene(chapterId: string, sceneIndex: number, toIndex: number): void {
    const chapter = this.findChapter(chapterId);
    chapter?.moveScene(sceneIndex, toIndex);
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
  deletePov(id: string): void {
    this._chapters.forEach((c) => c.deletePov(id));
  }

  copy(): NovelChapters {
    return new NovelChapters([...this._chapters]);
  }

  findChapter(chapterId: string): NovelChapter | null {
    return this._chapters.find((c) => c.id === chapterId) || null;
  }
}
