import { Novel, NovelScene } from '@owl/shared/novels/model';

export class NovelScenePageViewModel {
  readonly title: string;
  readonly content: string;

  readonly previousScene?: NovelScenePageNavigationViewModel;
  readonly nextScene?: NovelScenePageNavigationViewModel;

  private constructor(scene: NovelScene, novel: Novel) {
    this.title = scene.generalInfo.title;
    this.content = scene.content;

    const { previousScene, nextScene } = this.computePreviousAndNextScene(
      scene.id,
      novel
    );
    this.previousScene = previousScene;
    this.nextScene = nextScene;
  }

  computePreviousAndNextScene(
    sceneId: string,
    novel: Novel
  ): {
    previousScene?: NovelScenePageNavigationViewModel;
    nextScene?: NovelScenePageNavigationViewModel;
  } {
    const allScenes = novel.chapters.flatMap((c) =>
      c.scenes.map((s) => ({
        chapterId: c.id,
        sceneId: s.id,
        title: s.generalInfo.title,
      }))
    );
    const sceneIndex = allScenes.findIndex((s) => s.sceneId === sceneId);

    let previousScene: NovelScenePageNavigationViewModel | undefined;
    let nextScene: NovelScenePageNavigationViewModel | undefined;
    if (sceneIndex > 0) {
      const prev = allScenes[sceneIndex - 1];
      previousScene = new NovelScenePageNavigationViewModel(
        prev.chapterId,
        prev.sceneId,
        prev.title
      );
    }
    if (sceneIndex < allScenes.length - 1) {
      const next = allScenes[sceneIndex + 1];
      nextScene = new NovelScenePageNavigationViewModel(
        next.chapterId,
        next.sceneId,
        next.title
      );
    }
    return {
      previousScene,
      nextScene,
    };
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
    return new NovelScenePageViewModel(scene, novel);
  }
}

export class NovelScenePageNavigationViewModel {
  constructor(
    readonly chapterId: string,
    readonly sceneId: string,
    readonly title: string
  ) {}
}
