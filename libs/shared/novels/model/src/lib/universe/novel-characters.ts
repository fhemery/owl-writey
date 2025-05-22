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
    if (index !== undefined) {
      return new NovelCharacters([
        ...this._characters.slice(0, index),
        new NovelCharacter(id, name, description),
        ...this._characters.slice(index),
      ]);
    } else {
      return new NovelCharacters([
        ...this._characters,
        new NovelCharacter(id, name, description),
      ]);
    }
  }
  findCharacter(characterId: string): NovelCharacter | null {
    return this._characters.find((c) => c.id === characterId) || null;
  }
  updateCharacter(character: NovelCharacter): void {
    const index = this._characters.findIndex((c) => c.id === character.id);
    if (index !== -1) {
      this._characters.splice(index, 1, character);
    }
  }
  moveCharacter(from: number, to: number): void {
    const character = this._characters[from];
    this._characters.splice(from, 1);
    this._characters.splice(to, 0, character);
  }
  deleteCharacter(characterId: string): NovelCharacters {
    const character = this.findCharacter(characterId);
    if (!character) {
      return this;
    }
    return new NovelCharacters(
      this._characters.filter((c) => c.id !== characterId)
    );
  }
}
