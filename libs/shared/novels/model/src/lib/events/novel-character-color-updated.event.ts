import { NovelException } from '../exceptions/novel.exception';
import { Novel } from '../novel';
import { NovelBaseDomainEvent } from './novel-base-domain-event';

export interface NovelCharacterColorUpdatedEventData {
  characterId: string;
  color?: string;
}

export class NovelCharacterColorUpdatedEvent extends NovelBaseDomainEvent<NovelCharacterColorUpdatedEventData> {
  static readonly eventName = 'Novel:CharacterColorUpdated';
  static readonly eventVersion = '1';

  constructor(
    data: NovelCharacterColorUpdatedEventData,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ) {
    if (!data.characterId) {
      throw new NovelException('Character ID is required');
    }

    super(
      eventId,
      NovelCharacterColorUpdatedEvent.eventName,
      NovelCharacterColorUpdatedEvent.eventVersion,
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

    return novel.updateCharacter(character.withColor(this.data.color));
  }
}
