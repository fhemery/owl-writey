import { v4 as uuidV4 } from 'uuid';

import { ChapterNotFoundException } from '../exceptions/chapter-not-found.exception';
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

  addAt(name: string, outline = '', index?: number): void {
    if (index !== undefined) {
      this._chapters.splice(
        index,
        0,
        new NovelChapter(
          uuidV4(),
          new NovelChapterGeneralInfo(name, outline),
          []
        )
      );
    } else {
      this._chapters.push(
        new NovelChapter(
          uuidV4(),
          new NovelChapterGeneralInfo(name, outline),
          []
        )
      );
    }
  }
  update(chapter: NovelChapter): void {
    const index = this._chapters.findIndex((c) => c.id === chapter.id);
    if (index !== -1) {
      this._chapters.splice(index, 1, chapter);
    }
  }
  move(chapterIndex: number, toIndex: number): void {
    const chapter = this._chapters[chapterIndex];
    this._chapters.splice(chapterIndex, 1);
    this._chapters.splice(toIndex, 0, chapter);
  }
  delete(chapterId: string): void {
    const index = this._chapters.findIndex((c) => c.id === chapterId);
    if (index !== -1) {
      this._chapters.splice(index, 1);
    }
  }
  addSceneAt(
    chapterId: string,
    title: string,
    outline = '',
    index?: number
  ): void {
    const chapter = this.findChapter(chapterId);
    chapter.addNewSceneAt(title, outline, index);
  }
  updateScene(chapterId: string, scene: NovelScene): void {
    const chapter = this.findChapter(chapterId);
    chapter.updateScene(scene);
  }

  transferScene(
    initialChapterId: string,
    sceneId: string,
    targetChapterId: string,
    sceneIndex: number
  ): void {
    const initialChapter = this.findChapter(initialChapterId);
    const targetChapter = this.findChapter(targetChapterId);
    const scene = initialChapter.scenes.find((s) => s.id === sceneId);
    if (!scene) {
      return;
    }
    initialChapter.deleteScene(sceneId);
    targetChapter.addExistingSceneAt(scene, sceneIndex);
  }
  moveScene(chapterId: string, sceneIndex: number, toIndex: number): void {
    const chapter = this.findChapter(chapterId);
    chapter.moveScene(sceneIndex, toIndex);
  }
  deleteScene(chapterId: string, sceneId: string): void {
    const chapter = this.findChapter(chapterId);
    chapter.deleteScene(sceneId);
  }
  deletePov(id: string): void {
    this._chapters.forEach((c) => c.deletePov(id));
  }

  copy(): NovelChapters {
    return new NovelChapters([...this._chapters]);
  }

  private findChapter(chapterId: string): NovelChapter {
    const chapter = this._chapters.find((c) => c.id === chapterId);
    if (!chapter) {
      throw new ChapterNotFoundException(chapterId);
    }
    return chapter;
  }
}
