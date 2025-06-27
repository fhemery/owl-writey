import { NovelBaseTrackingEvent } from './novel-base-tracking-event';

export class NovelCharacterTagsChangedTrackingEvent extends NovelBaseTrackingEvent<{
  characterId: string;
  tags: string[];
}> {
  constructor(
    novelId: string,
    characterId: string,
    tags: string[],
    userId: string
  ) {
    super('novel.characterTagsChanged', novelId, { characterId, tags }, userId);
  }
}
