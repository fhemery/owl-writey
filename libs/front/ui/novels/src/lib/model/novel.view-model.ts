export class NovelViewModel {
  constructor(
    readonly id: string,
    readonly generalInfo: NovelGeneralInfoViewModel
  ) {}
}

export class NovelGeneralInfoViewModel {
  constructor(readonly title: string, readonly description: string) {}
}
