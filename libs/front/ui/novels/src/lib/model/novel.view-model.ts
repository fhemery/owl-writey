import { NovelRole } from '@owl/shared/novels/contracts';
import { v4 as uuidV4 } from 'uuid';

export class NovelViewModel {
  constructor(
    readonly id: string,
    readonly generalInfo: NovelGeneralInfoViewModel,
    readonly participants: NovelParticipantViewModel[],
    readonly chapters: NovelChapterViewModel[]
  ) {}

  addChapterAt(name: string, outline = '', index?: number): void {
    if (index !== undefined) {
      this.chapters.splice(
        index,
        0,
        new NovelChapterViewModel(uuidV4(), name, outline || '')
      );
    } else {
      this.chapters.push(
        new NovelChapterViewModel(uuidV4(), name, outline || '')
      );
    }
  }
  updateChapter(chapter: NovelChapterViewModel): void {
    const index = this.chapters.findIndex((c) => c.id === chapter.id);
    if (index !== -1) {
      this.chapters.splice(index, 1, chapter);
    }
  }
  moveChapter(chapterIndex: number, toIndex: number): void {
    const chapter = this.chapters[chapterIndex];
    this.chapters.splice(chapterIndex, 1);
    this.chapters.splice(toIndex, 0, chapter);
  }
  deleteChapter(chapter: NovelChapterViewModel): void {
    const index = this.chapters.findIndex((c) => c.id === chapter.id);
    if (index !== -1) {
      this.chapters.splice(index, 1);
    }
  }
  addSceneAt(
    chapterId: string,
    title: string,
    outline = '',
    index?: number
  ): void {
    const chapter = this.getChapter(chapterId);
    chapter.addSceneAt(title, outline, index);
  }
  updateScene(chapterId: string, scene: NovelSceneViewModel): void {
    const chapter = this.getChapter(chapterId);
    chapter.updateScene(scene);
  }
  deleteScene(chapterId: string, sceneId: string): void {
    const chapter = this.getChapter(chapterId);
    chapter.deleteScene(sceneId);
  }
  copy(): NovelViewModel {
    return new NovelViewModel(
      this.id,
      this.generalInfo,
      this.participants,
      this.chapters
    );
  }
  private getChapter(chapterId: string): NovelChapterViewModel {
    const chapter = this.chapters.find((c) => c.id === chapterId);
    if (!chapter) {
      throw new Error('Chapter not found');
    }
    return chapter;
  }
}

export class NovelGeneralInfoViewModel {
  constructor(readonly title: string, readonly description: string) {}
}

export class NovelParticipantViewModel {
  constructor(
    readonly uid: string,
    readonly name: string,
    readonly role: NovelRole
  ) {}
}

export class NovelChapterViewModel {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly outline: string,
    readonly scenes: NovelSceneViewModel[] = []
  ) {}

  addSceneAt(title: string, outline: string, index: number | undefined): void {
    if (index !== undefined) {
      this.scenes.splice(
        index,
        0,
        new NovelSceneViewModel(
          uuidV4(),
          new NovelSceneGeneralInfoViewModel(title, outline),
          ''
        )
      );
    } else {
      this.scenes.push(
        new NovelSceneViewModel(
          uuidV4(),
          new NovelSceneGeneralInfoViewModel(title, outline),
          ''
        )
      );
    }
  }
  updateScene(scene: NovelSceneViewModel): void {
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
}

export class NovelSceneViewModel {
  constructor(
    readonly id: string,
    readonly generalInfo: NovelSceneGeneralInfoViewModel,
    readonly text: string
  ) {}
}

export class NovelSceneGeneralInfoViewModel {
  constructor(readonly title: string, readonly outline: string) {}
}
