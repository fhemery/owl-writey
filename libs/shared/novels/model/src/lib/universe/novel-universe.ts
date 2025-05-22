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
  updateCharacter(character: NovelCharacter): void {
    this._characters.updateCharacter(character);
  }
  moveCharacter(from: number, to: number): void {
    this._characters.moveCharacter(from, to);
  }
  deleteCharacter(characterId: string): void {
    this._characters.deleteCharacter(characterId);
  }
  copy(): NovelUniverse {
    return new NovelUniverse([...this._characters.characters]);
  }

  private withCharacters(characters: NovelCharacters): NovelUniverse {
    return new NovelUniverse(characters.characters);
  }
}
