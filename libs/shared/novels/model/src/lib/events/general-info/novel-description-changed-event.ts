import { NovelException } from '../../exceptions/novel.exception';
import { Novel } from '../../novel';
import { NovelBaseDomainEvent } from '../novel-base-domain-event';

export interface NovelDescriptionChangedEventData {
  description: string;
}
export class NovelDescriptionChangedEvent extends NovelBaseDomainEvent<NovelDescriptionChangedEventData> {
  static readonly eventName = 'Novel:DescriptionChanged';
  static readonly eventVersion = '1';

  constructor(
    data: NovelDescriptionChangedEventData,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ) {
    if (data.description === undefined) {
      throw new NovelException('Description is required');
    }

    super(
      eventId,
      NovelDescriptionChangedEvent.eventName,
      NovelDescriptionChangedEvent.eventVersion,
      userId,
      {
        description: data.description,
      },
      eventSequentialId
    );
  }

  applyTo(novel: Novel): Novel {
    return novel.updateDescription(this.data.description);
  }
}
