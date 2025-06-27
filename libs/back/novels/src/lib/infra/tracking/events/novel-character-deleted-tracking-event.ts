import { NovelBaseTrackingEvent } from './novel-base-tracking-event';

export class NovelCharacterDeletedTrackingEvent extends NovelBaseTrackingEvent<{
  characterId: string;
}> {
  constructor(novelId: string, characterId: string, userId: string) {
    super('novel.characterDeleted', novelId, { characterId }, userId);
  }
}
