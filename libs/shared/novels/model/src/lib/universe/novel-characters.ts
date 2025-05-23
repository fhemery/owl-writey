import { arrayUtils } from '@owl/shared/common/utils';

import { NovelCharacter } from './novel-character';

export class NovelCharacters {
  private _characters: NovelCharacter[];
  constructor(_characters: NovelCharacter[] = []) {
    this._characters = _characters;
  }

  get characters(): NovelCharacter[] {
    return [...this._characters];
  }
  copy(): NovelCharacters {
    return new NovelCharacters([...this._characters]);
  }
  addCharacterAt(
    id: string,
    name: string,
    description: string,
    index?: number
  ): NovelCharacters {
    return new NovelCharacters(
      arrayUtils.insertAt(
        this._characters,
        new NovelCharacter(id, name, description),
        index
      )
    );
  }
  findCharacter(characterId: string): NovelCharacter | null {
    return this._characters.find((c) => c.id === characterId) || null;
  }
  updateCharacter(character: NovelCharacter): NovelCharacters {
    return new NovelCharacters(
      arrayUtils.replaceItem(this._characters, character)
    );
  }
  moveCharacter(characterId: string, toIndex: number): NovelCharacters {
    return new NovelCharacters(
      arrayUtils.moveItem(this._characters, characterId, toIndex)
    );
  }
  deleteCharacter(characterId: string): NovelCharacters {
    return new NovelCharacters(
      arrayUtils.removeItem(this._characters, characterId)
    );
  }
}
