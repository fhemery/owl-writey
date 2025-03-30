import { SseEvent } from '@owl/shared/common/contracts';
import { EventSourcePolyfill } from 'event-source-polyfill';

import { waitFor } from './test-utils';

export class SseEventList {
  _events: SseEvent[] = [];
  _error: { status: number } | undefined;

  constructor(private eventSource: EventSourcePolyfill) {}

  addEvent(event: SseEvent): void {
    this._events.push(event);
  }

  getLatest<T>(eventType: string): T {
    return this._events.filter((e) => e.event === eventType).pop() as T;
  }

  setError(error: { status: number }): void {
    this._error = error;
  }

  close(): void {
    this.eventSource.close();
  }
}

export class SseUtils {
  eventSources: EventSourcePolyfill[] = [];

  async connect(url: string): Promise<SseEventList> {
    const eventSourcePolyfill = new EventSourcePolyfill(url);
    const events = new SseEventList(eventSourcePolyfill);
    this.eventSources.push(eventSourcePolyfill);

    eventSourcePolyfill.onerror = (error: unknown): void => {
      events.setError(error as { status: number });
    };
    eventSourcePolyfill.onmessage = (event: { data: string }): void => {
      events.addEvent(JSON.parse(event.data) as SseEvent);
    };
    await waitFor(100);
    return events;
  }

  disconnectAll(): void {
    for (const source of this.eventSources) {
      source.close();
    }
  }
}
