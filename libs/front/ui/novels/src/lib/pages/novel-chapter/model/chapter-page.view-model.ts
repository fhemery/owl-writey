import {
  Novel,
  NovelChapter,
  NovelCharacter,
  NovelScene,
} from '@owl/shared/novels/model';

export interface ChapterNavigation {
  id: string;
  title: string;
}

export class ChapterPageViewModel {
  readonly id: string;
  readonly title: string;
  readonly chapter: NovelChapter; // Expose the full chapter reference
  readonly scenes: ChapterPageSceneViewModel[];
  readonly nbWords: number;
  readonly characters: ChapterPageCharacterViewModel[];
  readonly previousChapter?: ChapterPageOtherChapterViewModel;
  readonly nextChapter?: ChapterPageOtherChapterViewModel;

  constructor(chapter: NovelChapter, novel: Novel) {
    this.id = chapter.id;
    this.chapter = chapter;
    this.title = chapter.generalInfo.title;
    this.scenes = chapter.scenes.map(
      (scene) => new ChapterPageSceneViewModel(scene, novel)
    );
    this.characters = novel.universe.characters.map(
      (character) => new ChapterPageCharacterViewModel(character)
    );
    this.nbWords = chapter.scenes.reduce(
      (acc, scene) => acc + scene.nbWords,
      0
    );

    const chapterIndex = novel.chapters.findIndex((c) => c.id === chapter.id);
    if (chapterIndex > 0) {
      this.previousChapter = new ChapterPageOtherChapterViewModel(
        novel.chapters[chapterIndex - 1]
      );
    }
    if (chapterIndex < novel.chapters.length - 1) {
      this.nextChapter = new ChapterPageOtherChapterViewModel(
        novel.chapters[chapterIndex + 1]
      );
    }
  }

  static From(
    novel: Novel | null = null,
    chapterId: string
  ): ChapterPageViewModel | undefined {
    const chapter = novel?.chapters.find((chapter) => chapter.id === chapterId);
    if (!novel || !chapter) {
      return undefined;
    }

    return new ChapterPageViewModel(chapter, novel);
  }
}

export class ChapterPageSceneViewModel {
  readonly id: string;
  readonly title: string;
  readonly outline: string;
  readonly nbWords: number;
  readonly pov?: ChapterPagePovViewModel;

  constructor(scene: NovelScene, novel: Novel) {
    this.id = scene.id;
    this.title = scene.generalInfo.title;
    this.outline = scene.generalInfo.outline;
    this.nbWords = scene.nbWords;
    if (scene.generalInfo.pov) {
      const character = novel.findCharacter(scene.generalInfo.pov);
      if (character) {
        this.pov = new ChapterPagePovViewModel(
          scene.generalInfo.pov,
          character.name,
          character.properties.color || 'black'
        );
      }
    }
  }
}

export class ChapterPagePovViewModel {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly color: string
  ) {}
}

export class ChapterPageCharacterViewModel {
  readonly id: string;
  readonly name: string;

  constructor(character: NovelCharacter) {
    this.id = character.id;
    this.name = character.name;
  }
}

export class ChapterPageOtherChapterViewModel {
  readonly id: string;
  readonly title: string;

  constructor(chapter: NovelChapter) {
    this.id = chapter.id;
    this.title = chapter.generalInfo.title;
  }
}
