import { NovelException } from '../../exceptions/novel.exception';
import { Novel } from '../../novel';
import { NovelBaseDomainEvent } from '../novel-base-domain-event';

export interface NovelCharacterAddedEventData {
  characterId: string;
  name: string;
  description: string;
  at?: number;
}

export class NovelCharacterAddedEvent extends NovelBaseDomainEvent {
  static readonly eventName = 'Novel:CharacterAdded';
  static readonly eventVersion = '1';

  constructor(
    public override readonly data: NovelCharacterAddedEventData,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ) {
    if (!data.characterId) {
      throw new NovelException('Character ID is required');
    }

    if (!data.name?.trim()) {
      throw new NovelException('Character name is required');
    }

    if (data.description === undefined) {
      throw new NovelException('Character description is required');
    }

    super(
      eventId,
      NovelCharacterAddedEvent.eventName,
      NovelCharacterAddedEvent.eventVersion,
      userId,
      data,
      eventSequentialId
    );
  }

  applyTo(novel: Novel): Novel {
    return novel.addCharacterAt(
      this.data.characterId,
      this.data.name,
      this.data.description,
      this.data.at
    );
  }
}
