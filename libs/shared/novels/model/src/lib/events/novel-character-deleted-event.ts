import { NovelException } from '../exceptions/novel.exception';
import { Novel } from '../novel';
import { NovelBaseDomainEvent } from './novel-base-domain-event';

export interface NovelCharacterDeletedEventData {
  characterId: string;
}

export class NovelCharacterDeletedEvent extends NovelBaseDomainEvent {
  static readonly eventName = 'Novel:CharacterDeleted';
  static readonly eventVersion = '1';

  static From(
    data: unknown,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ): NovelCharacterDeletedEvent {
    const eventData = data as NovelCharacterDeletedEventData;

    return new NovelCharacterDeletedEvent(
      eventData,
      userId,
      eventId,
      eventSequentialId
    );
  }

  constructor(
    public override readonly data: NovelCharacterDeletedEventData,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ) {
    if (!data.characterId) {
      throw new NovelException('Character ID is required');
    }

    super(
      eventId,
      NovelCharacterDeletedEvent.eventName,
      NovelCharacterDeletedEvent.eventVersion,
      userId,
      data,
      eventSequentialId
    );
  }

  applyTo(novel: Novel): Novel {
    return novel.deleteCharacter(this.data.characterId);
  }
}
