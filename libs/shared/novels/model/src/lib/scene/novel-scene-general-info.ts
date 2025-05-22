export class NovelSceneGeneralInfo {
  constructor(
    readonly title: string,
    readonly outline: string,
    public pov?: string
  ) {}

  deletePov(characterId: string): void {
    if (this.pov === characterId) {
      this.pov = undefined;
    }
  }
  withTitle(title: string): NovelSceneGeneralInfo {
    return new NovelSceneGeneralInfo(title, this.outline, this.pov);
  }
}
