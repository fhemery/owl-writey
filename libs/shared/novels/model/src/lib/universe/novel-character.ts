export class NovelCharacter {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly tags: string[] = [],
    readonly properties: NovelCharacterProperties = {}
  ) {}

  withName(name: string): NovelCharacter {
    return new NovelCharacter(
      this.id,
      name,
      this.description,
      this.tags,
      this.properties
    );
  }
}

export interface NovelCharacterProperties {
  readonly color?: string;
}
