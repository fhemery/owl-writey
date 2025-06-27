import { NovelBaseTrackingEvent } from './novel-base-tracking-event';

export class NovelCharacterAddedTrackingEvent extends NovelBaseTrackingEvent<{
  characterId: string;
}> {
  constructor(novelId: string, characterId: string, userId: string) {
    super('novel.characterAdded', novelId, { characterId }, userId);
  }
}
