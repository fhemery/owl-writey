export class NovelGeneralInfo {
  constructor(
    readonly title: string,
    readonly description = '',
    readonly authorUid: string
  ) {}
}
