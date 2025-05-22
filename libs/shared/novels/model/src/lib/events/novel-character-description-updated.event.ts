import { NovelException } from '../exceptions/novel.exception';
import { Novel } from '../novel';
import { NovelBaseDomainEvent } from './novel-base-domain-event';

export interface NovelCharacterDescriptionUpdatedEventData {
  characterId: string;
  description: string;
}

export class NovelCharacterDescriptionUpdatedEvent extends NovelBaseDomainEvent<NovelCharacterDescriptionUpdatedEventData> {
  static readonly eventName = 'Novel:CharacterDescriptionUpdated';
  static readonly eventVersion = '1';

  constructor(
    data: NovelCharacterDescriptionUpdatedEventData,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ) {
    if (!data.characterId) {
      throw new NovelException('Character ID is required');
    }

    if (data.description === undefined) {
      throw new NovelException('Character description cannot be empty');
    }

    super(
      eventId,
      NovelCharacterDescriptionUpdatedEvent.eventName,
      NovelCharacterDescriptionUpdatedEvent.eventVersion,
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

    return novel.updateCharacter(
      character.withDescription(this.data.description)
    );
  }
}
