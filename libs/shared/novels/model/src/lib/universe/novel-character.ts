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

  withDescription(description: string): NovelCharacter {
    return new NovelCharacter(
      this.id,
      this.name,
      description,
      this.tags,
      this.properties
    );
  }

  withTags(tags: string[]): NovelCharacter {
    return new NovelCharacter(
      this.id,
      this.name,
      this.description,
      tags,
      this.properties
    );
  }

  withColor(color?: string): NovelCharacter {
    return new NovelCharacter(this.id, this.name, this.description, this.tags, {
      ...this.properties,
      color,
    });
  }
}

export interface NovelCharacterProperties {
  readonly color?: string;
}
