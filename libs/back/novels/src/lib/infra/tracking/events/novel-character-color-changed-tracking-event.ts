import { NovelBaseTrackingEvent } from './novel-base-tracking-event';

export class NovelCharacterColorChangedTrackingEvent extends NovelBaseTrackingEvent<{
  characterId: string;
  color: string;
}> {
  constructor(
    novelId: string,
    characterId: string,
    color: string,
    userId: string
  ) {
    super(
      'novel.characterColorChanged',
      novelId,
      { characterId, color },
      userId
    );
  }
}
