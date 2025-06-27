import { NovelException } from '../../exceptions/novel.exception';
import { Novel } from '../../novel';
import { NovelBaseDomainEvent } from '../novel-base-domain-event';

export interface NovelCharacterTagsUpdatedEventData {
  characterId: string;
  tags: string[];
}

export class NovelCharacterTagsUpdatedEvent extends NovelBaseDomainEvent<NovelCharacterTagsUpdatedEventData> {
  static readonly eventName = 'Novel:CharacterTagsUpdated';
  static readonly eventVersion = '1';

  constructor(
    data: NovelCharacterTagsUpdatedEventData,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ) {
    if (!data.characterId) {
      throw new NovelException('Character ID is required');
    }

    if (!data.tags || !Array.isArray(data.tags)) {
      throw new NovelException('Character tags must be an array');
    }

    super(
      eventId,
      NovelCharacterTagsUpdatedEvent.eventName,
      NovelCharacterTagsUpdatedEvent.eventVersion,
      userId,
      data,
      eventSequentialId
    );
  }

  applyTo(novel: Novel): Novel {
    const character = novel.findCharacter(this.data.characterId);

    if (!character) {
      return novel;
    }

    return novel.updateCharacter(character.withTags(this.data.tags));
  }
}
