import { EmittedEvent } from '@owl/back/infra/events';
import { Novel } from '@owl/shared/novels/model';

export class NovelCreateEvent implements EmittedEvent<Novel> {
  static readonly EventName = 'novel:created';

  readonly name = NovelCreateEvent.EventName;
  constructor(public readonly payload: Novel) {}
}
