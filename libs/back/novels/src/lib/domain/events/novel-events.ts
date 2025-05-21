import { EmittedEvent } from '@owl/back/infra/events';
import { Novel } from '@owl/shared/novels/model';

export class NovelCreatedEvent implements EmittedEvent<Novel> {
  static readonly EventName = 'novel:created';

  readonly name = NovelCreatedEvent.EventName;
  constructor(public readonly payload: Novel) {}
}

export class NovelDeletedEvent implements EmittedEvent<Novel> {
  static readonly EventName = 'novel:deleted';

  readonly name = NovelDeletedEvent.EventName;
  constructor(public readonly payload: Novel) {}
}
