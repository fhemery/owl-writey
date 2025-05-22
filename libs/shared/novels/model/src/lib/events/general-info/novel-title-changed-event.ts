import { NovelException } from '../../exceptions/novel.exception';
import { Novel } from '../../novel';
import { NovelBaseDomainEvent } from '../novel-base-domain-event';

export interface NovelTitleChangedEventData {
  title: string;
}

export class NovelTitleChangedEvent extends NovelBaseDomainEvent<NovelTitleChangedEventData> {
  static readonly eventName = 'Novel:TitleChanged';
  static readonly eventVersion = '1';

  constructor(
    data: NovelTitleChangedEventData,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ) {
    if (!data.title.trim()) {
      throw new NovelException('Title is required');
    }

    if (data.title.length < 3) {
      throw new NovelException('Title must be at least 3 characters long');
    }

    super(
      eventId,
      NovelTitleChangedEvent.eventName,
      NovelTitleChangedEvent.eventVersion,
      userId,
      {
        title: data.title,
      },
      eventSequentialId
    );
  }

  applyTo(novel: Novel): Novel {
    return novel.updateTitle(this.data.title);
  }
}
