import { NovelCharacter } from './novel-character';

export class NovelUniverse {
  constructor(readonly characters: NovelCharacter[] = []) {}
}
