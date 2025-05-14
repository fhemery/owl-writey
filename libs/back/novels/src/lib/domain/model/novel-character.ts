export class NovelCharacter {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly tags: string[] = []
  ) {}
}
