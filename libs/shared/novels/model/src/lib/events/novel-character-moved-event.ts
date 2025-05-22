import { NovelException } from '../exceptions/novel.exception';
import { Novel } from '../novel';
import { NovelBaseDomainEvent } from './novel-base-domain-event';

export interface NovelCharacterMovedEventData {
  characterId: string;
  toIndex: number;
}

export class NovelCharacterMovedEvent extends NovelBaseDomainEvent {
  static readonly eventName = 'Novel:CharacterMoved';
  static readonly eventVersion = '1';

  static From(
    data: unknown,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ): NovelCharacterMovedEvent {
    const eventData = data as NovelCharacterMovedEventData;

    return new NovelCharacterMovedEvent(
      eventData,
      userId,
      eventId,
      eventSequentialId
    );
  }

  constructor(
    public override readonly data: NovelCharacterMovedEventData,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ) {
    if (!data.characterId) {
      throw new NovelException('Character ID is required');
    }
    if (data.toIndex === undefined || data.toIndex < 0) {
      throw new NovelException('To index must be non-negative');
    }

    super(
      eventId,
      NovelCharacterMovedEvent.eventName,
      NovelCharacterMovedEvent.eventVersion,
      userId,
      data,
      eventSequentialId
    );
  }

  applyTo(novel: Novel): Novel {
    return novel.doMoveCharacter(this.data.characterId, this.data.toIndex);
  }
}
