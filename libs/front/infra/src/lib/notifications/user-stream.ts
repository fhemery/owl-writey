import { SseEvent } from '@owl/shared/common/contracts';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { Subject } from 'rxjs';

export class UserStream {
  constructor(
    private readonly eventSource: EventSourcePolyfill,
    readonly stream: Subject<{ data: SseEvent }>
  ) {}

  close(): void {
    this.eventSource.close();
  }
}
