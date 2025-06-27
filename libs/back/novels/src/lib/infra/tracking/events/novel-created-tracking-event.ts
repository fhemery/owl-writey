import { NovelBaseTrackingEvent } from './novel-base-tracking-event';

export class NovelCreatedTrackingEvent extends NovelBaseTrackingEvent<{
  title: string;
  authorId: string;
}> {
  constructor(
    novelId: string,
    readonly title: string,
    readonly authorId: string,
    userId: string
  ) {
    super('novel.created', novelId, { title, authorId }, userId);
  }
}
