import { NovelSceneGeneralInfo } from './novel-scene-general-info';

export class NovelScene {
  constructor(
    readonly id: string,
    readonly generalInfo: NovelSceneGeneralInfo,
    readonly content: string
  ) {}

  deletePov(characterId: string): void {
    if (this.generalInfo.pov === characterId) {
      this.generalInfo.pov = undefined;
    }
  }

  withTitle(title: string): NovelScene {
    return new NovelScene(
      this.id,
      this.generalInfo.withTitle(title),
      this.content
    );
  }

  updateOutline(outline: string): NovelScene {
    return new NovelScene(
      this.id,
      this.generalInfo.withOutline(outline),
      this.content
    );
  }
}
