import { EmittedEvent } from '@owl/back/infra/events';
import { Novel, NovelBaseDomainEvent } from '@owl/shared/novels/model';

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

export class NovelUpdatedEvent
  implements EmittedEvent<{ novel: Novel; event: NovelBaseDomainEvent }>
{
  static readonly EventName = 'novel:updated';

  readonly name = NovelUpdatedEvent.EventName;
  constructor(
    public readonly payload: { novel: Novel; event: NovelBaseDomainEvent }
  ) {}
}
