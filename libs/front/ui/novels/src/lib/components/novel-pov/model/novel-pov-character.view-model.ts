import { NovelCharacter } from '@owl/shared/novels/model';

export class NovelPovCharacterViewModel {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly color?: string
  ) {}

  static From(character: NovelCharacter): NovelPovCharacterViewModel {
    return new NovelPovCharacterViewModel(
      character.id,
      character.name,
      character.properties.color
    );
  }
}
