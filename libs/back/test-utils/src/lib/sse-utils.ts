import { SseEvent } from '@owl/shared/contracts';
import { EventSourcePolyfill } from 'event-source-polyfill';

import { waitFor } from './test-utils';

export class SseEventList {
  _events: SseEvent[] = [];

  addEvent(event: SseEvent): void {
    this._events.push(event);
  }

  getLatest<T>(eventType: string): T {
    return this._events.filter((e) => e.event === eventType).pop() as T;
  }
}

export class SseUtils {
  eventSources: EventSourcePolyfill[] = [];

  async connect(url: string): Promise<SseEventList> {
    const events = new SseEventList();
    const eventSource = new EventSourcePolyfill(url);
    this.eventSources.push(eventSource);
    eventSource.onerror = (error: unknown): void => {
      console.error('SSE connection error:', error);
    };
    eventSource.onmessage = (event: { data: string }): void => {
      events.addEvent(JSON.parse(event.data) as SseEvent);
    };
    await waitFor(10);
    return events;
  }

  disconnectAll(): void {
    for (const source of this.eventSources) {
      source.close();
    }
  }
}
