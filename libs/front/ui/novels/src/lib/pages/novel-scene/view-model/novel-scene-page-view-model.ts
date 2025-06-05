import { Novel, NovelScene } from '@owl/shared/novels/model';

export class NovelScenePageViewModel {
  readonly title: string;
  readonly content: string;

  readonly previousScene?: NovelScenePageNavigationViewModel;
  readonly nextScene?: NovelScenePageNavigationViewModel;

  private constructor(scene: NovelScene, chapterId: string, novel: Novel) {
    this.title = scene.generalInfo.title;
    this.content = scene.content;

    this.previousScene = this.computePreviousScene(scene, chapterId, novel);
    this.nextScene = this.computeNextScene(scene, chapterId, novel);
  }

  computePreviousScene(
    scene: NovelScene,
    chapterId: string,
    novel: Novel
  ): NovelScenePageNavigationViewModel | undefined {
    const chapter = novel.findChapter(chapterId);
    const chapterIndex = novel.chapters.findIndex((c) => c.id === chapterId);
    if (!chapter) {
      return undefined;
    }
    const sceneIndex = chapter.scenes.findIndex((s) => s.id === scene.id);
    if (sceneIndex === 0 && chapterIndex > 0) {
      const previousChapter = novel.chapters[chapterIndex - 1];
      const previousScene =
        previousChapter.scenes[previousChapter.scenes.length - 1];
      return new NovelScenePageNavigationViewModel(
        previousChapter.id,
        previousScene.id,
        previousScene.generalInfo.title
      );
    }
    if (sceneIndex > 0) {
      const previousScene = chapter.scenes[sceneIndex - 1];
      return new NovelScenePageNavigationViewModel(
        chapterId,
        previousScene.id,
        previousScene.generalInfo.title
      );
    }
    return undefined;
  }

  computeNextScene(
    scene: NovelScene,
    chapterId: string,
    novel: Novel
  ): NovelScenePageNavigationViewModel | undefined {
    const chapter = novel.findChapter(chapterId);
    const chapterIndex = novel.chapters.findIndex((c) => c.id === chapterId);
    if (!chapter) {
      return undefined;
    }
    const sceneIndex = chapter.scenes.findIndex((s) => s.id === scene.id);
    if (
      sceneIndex === chapter.scenes.length - 1 &&
      chapterIndex < novel.chapters.length - 1
    ) {
      const nextChapter = novel.chapters[chapterIndex + 1];
      const nextScene = nextChapter.scenes[0];
      return new NovelScenePageNavigationViewModel(
        nextChapter.id,
        nextScene.id,
        nextScene.generalInfo.title
      );
    }
    if (sceneIndex < chapter.scenes.length - 1) {
      const nextScene = chapter.scenes[sceneIndex + 1];
      return new NovelScenePageNavigationViewModel(
        chapterId,
        nextScene.id,
        nextScene.generalInfo.title
      );
    }
    return undefined;
  }

  static From(
    chapterId: string,
    sceneId: string,
    novel: Novel | null
  ): NovelScenePageViewModel | null {
    const scene = novel?.findScene(chapterId, sceneId);
    if (!novel || !scene) {
      return null;
    }
    return new NovelScenePageViewModel(scene, chapterId, novel);
  }
}

export class NovelScenePageNavigationViewModel {
  constructor(
    readonly chapterId: string,
    readonly sceneId: string,
    readonly title: string
  ) {}
}
