import { NovelException } from '../exceptions/novel.exception';
import { Novel } from '../novel';
import { NovelBaseDomainEvent } from './novel-base-domain-event';

export interface NovelChapterTitleUpdatedEventData {
  id: string;
  title: string;
}

export class NovelChapterTitleUpdatedEvent extends NovelBaseDomainEvent<NovelChapterTitleUpdatedEventData> {
  static readonly eventName = 'Novel:ChapterTitleUpdated';
  static readonly eventVersion = '1';

  static From(
    data: unknown,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ): NovelChapterTitleUpdatedEvent {
    const eventData = data as NovelChapterTitleUpdatedEventData;

    return new NovelChapterTitleUpdatedEvent(
      eventData,
      userId,
      eventId,
      eventSequentialId
    );
  }

  constructor(
    data: NovelChapterTitleUpdatedEventData,
    userId: string,
    eventId?: string,
    eventSequentialId?: number
  ) {
    if (!data.id) {
      throw new NovelException('Chapter ID is required');
    }

    if (!data.title?.trim()) {
      throw new NovelException('Chapter title cannot be empty');
    }

    super(
      eventId,
      NovelChapterTitleUpdatedEvent.eventName,
      NovelChapterTitleUpdatedEvent.eventVersion,
      userId,
      data,
      eventSequentialId
    );
  }

  applyTo(novel: Novel): Novel {
    const chapter = novel.findChapter(this.data.id);

    if (!chapter) {
      return novel;
    }

    // Create a copy of the novel and update the chapter
    return novel.updateChapter(chapter.updateTitle(this.data.title));
  }
}
