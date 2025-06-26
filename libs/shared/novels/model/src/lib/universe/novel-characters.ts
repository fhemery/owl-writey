import { v4 as uuidV4 } from 'uuid';

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
  addCharacterAt(name: string, description: string, index?: number): void {
    if (index !== undefined) {
      this._characters.splice(
        index,
        0,
        new NovelCharacter(uuidV4(), name, description)
      );
    } else {
      this._characters.push(new NovelCharacter(uuidV4(), name, description));
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
  deleteCharacter(characterId: string): void {
    const index = this._characters.findIndex((c) => c.id === characterId);
    if (index !== -1) {
      this._characters.splice(index, 1);
    }
  }
}
