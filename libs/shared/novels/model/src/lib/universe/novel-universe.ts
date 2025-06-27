import { NovelCharacter } from './novel-character';
import { NovelCharacters } from './novel-characters';

export class NovelUniverse {
  private _characters: NovelCharacters;
  constructor(_characters: NovelCharacter[] = []) {
    this._characters = new NovelCharacters(_characters);
  }

  get characters(): NovelCharacter[] {
    return [...this._characters.characters];
  }
  addCharacterAt(
    id: string,
    name: string,
    description: string,
    index?: number
  ): NovelUniverse {
    return this.withCharacters(
      this._characters.addCharacterAt(id, name, description, index)
    );
  }
  findCharacter(characterId: string): NovelCharacter | null {
    return this._characters.findCharacter(characterId) || null;
  }
  updateCharacter(character: NovelCharacter): NovelUniverse {
    return this.withCharacters(this._characters.updateCharacter(character));
  }
  moveCharacter(characterId: string, toIndex: number): NovelUniverse {
    return this.withCharacters(
      this._characters.moveCharacter(characterId, toIndex)
    );
  }
  deleteCharacter(characterId: string): NovelUniverse {
    return this.withCharacters(this._characters.deleteCharacter(characterId));
  }
  copy(): NovelUniverse {
    return new NovelUniverse([...this._characters.characters]);
  }

  private withCharacters(characters: NovelCharacters): NovelUniverse {
    return new NovelUniverse(characters.characters);
  }
}
