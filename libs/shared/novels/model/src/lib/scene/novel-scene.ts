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
}
