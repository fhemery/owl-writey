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
  addSceneAt(
    chapterId: string,
    title: string,
    outline = '',
    index?: number
  ): void {
    const chapter = this.chapters.find((c) => c.id === chapterId);
    if (!chapter) {
      throw new Error('Chapter not found');
    }
    chapter.addSceneAt(title, outline, index);
  }
  updateScene(chapterId: string, scene: NovelSceneViewModel): void {
    const chapter = this.chapters.find((c) => c.id === chapterId);
    if (!chapter) {
      throw new Error('Chapter not found');
    }
    chapter.updateScene(scene);
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
