import { TrackingEvent } from '@owl/back/tracking';

export class NovelCreatedTrackingEvent extends TrackingEvent {
  constructor(
    readonly novelId: string,
    readonly title: string,
    readonly authorId: string
  ) {
    super('novel.created', { novelId, title, authorId }, authorId, novelId);
  }
}
