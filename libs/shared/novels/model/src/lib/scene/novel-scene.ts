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
    return this.withGeneralInfo(this.generalInfo.withTitle(title));
  }

  updateOutline(outline: string): NovelScene {
    return this.withGeneralInfo(this.generalInfo.withOutline(outline));
  }

  updatePov(povId?: string): NovelScene {
    return this.withGeneralInfo(this.generalInfo.withPov(povId));
  }

  private withGeneralInfo(generalInfo: NovelSceneGeneralInfo): NovelScene {
    return new NovelScene(this.id, generalInfo, this.content);
  }
}
