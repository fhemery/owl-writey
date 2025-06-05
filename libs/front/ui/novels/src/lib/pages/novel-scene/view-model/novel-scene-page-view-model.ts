import { Novel, NovelScene } from '@owl/shared/novels/model';

export class NovelScenePageViewModel {
  readonly title: string;
  readonly content: string;

  private constructor(scene: NovelScene) {
    this.title = scene.generalInfo.title;
    this.content = scene.content;
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
    return new NovelScenePageViewModel(scene);
  }
}
