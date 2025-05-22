import { NovelException } from '../exceptions/novel.exception';
import { Novel } from '../novel';
import { NovelBaseDomainEvent } from './novel-base-domain-event';

export interface NovelCharacterNameUpdatedEventData {
  id: string;
  name: string;
}

export class NovelCharacterNameUpdatedEvent extends NovelBaseDomainEvent<NovelCharacterNameUpdatedEventData> {
  static readonly eventName = 'Novel:CharacterNameUpdated';
  static readonly eventVersion = '1';

  static From(
    data: unknown,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ): NovelCharacterNameUpdatedEvent {
    const eventData = data as NovelCharacterNameUpdatedEventData;

    return new NovelCharacterNameUpdatedEvent(
      eventData,
      userId,
      eventId,
      eventSequentialId
    );
  }

  constructor(
    data: NovelCharacterNameUpdatedEventData,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ) {
    if (!data.id) {
      throw new NovelException('Character ID is required');
    }

    if (!data.name?.trim()) {
      throw new NovelException('Character name cannot be empty');
    }

    super(
      eventId,
      NovelCharacterNameUpdatedEvent.eventName,
      NovelCharacterNameUpdatedEvent.eventVersion,
      userId,
      data,
      eventSequentialId
    );
  }

  applyTo(novel: Novel): Novel {
    const character = novel.findCharacter(this.data.id);

    if (!character) {
      return novel;
    }

    return novel.updateCharacter(character.withName(this.data.name));
  }
}
