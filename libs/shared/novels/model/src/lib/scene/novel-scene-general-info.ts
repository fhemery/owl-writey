export class NovelSceneGeneralInfo {
  constructor(
    readonly title: string,
    readonly outline: string,
    public pov?: string,
    public notes?: string
  ) {}

  withTitle(title: string): NovelSceneGeneralInfo {
    return new NovelSceneGeneralInfo(title, this.outline, this.pov, this.notes);
  }

  withOutline(outline: string): NovelSceneGeneralInfo {
    return new NovelSceneGeneralInfo(this.title, outline, this.pov, this.notes);
  }
  withPov(povId?: string): NovelSceneGeneralInfo {
    return new NovelSceneGeneralInfo(
      this.title,
      this.outline,
      povId,
      this.notes
    );
  }
  withNotes(notes?: string): NovelSceneGeneralInfo {
    return new NovelSceneGeneralInfo(this.title, this.outline, this.pov, notes);
  }
}
