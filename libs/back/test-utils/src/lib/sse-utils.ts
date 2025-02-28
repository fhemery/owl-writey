import { SseEvent } from '@owl/shared/contracts';
import { EventSourcePolyfill } from 'event-source-polyfill';

import { waitFor } from './test-utils';

export class SseEventList {
  _events: SseEvent[] = [];
  _error: { status: number } | undefined;

  addEvent(event: SseEvent): void {
    this._events.push(event);
  }

  getLatest<T>(eventType: string): T {
    return this._events.filter((e) => e.event === eventType).pop() as T;
  }

  setError(error: { status: number }): void {
    this._error = error;
  }
}

export class SseUtils {
  eventSources: EventSourcePolyfill[] = [];

  async connect(url: string): Promise<SseEventList> {
    const events = new SseEventList();
    const eventSourcePolyfill = new EventSourcePolyfill(url);
    this.eventSources.push(eventSourcePolyfill);

    /*eventSourcePolyfill.onopen = (): void => {
      console.log('SSE connection opened');
    };*/
    eventSourcePolyfill.onerror = (error: unknown): void => {
      // console.error('SSE connection error:', error);
      events.setError(error as { status: number });
    };
    eventSourcePolyfill.onmessage = (event: { data: string }): void => {
      // console.log('SSE event received:', event.data);
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
