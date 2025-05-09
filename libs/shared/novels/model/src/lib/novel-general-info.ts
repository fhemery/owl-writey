export class NovelGeneralInfo {
  constructor(readonly title: string, readonly description: string) {}
  copy(): NovelGeneralInfo {
    return new NovelGeneralInfo(this.title, this.description);
  }
}
