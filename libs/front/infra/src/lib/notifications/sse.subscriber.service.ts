import { inject, Injectable } from '@angular/core';
import { AUTH_SERVICE } from '@owl/front/auth';
import { SseEvent } from '@owl/shared/common/contracts';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { Subject } from 'rxjs';

import { UserStream } from './user-stream';

@Injectable({
  providedIn: 'root',
})
export class SseSubscriberService {
  private auth = inject(AUTH_SERVICE);

  async connect(url: string): Promise<UserStream> {
    const token = await this.auth.getToken();
    const subject = new Subject<{ data: SseEvent }>();
    const eventSource = new EventSourcePolyfill(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      heartbeatTimeout: 60000,
    });

    // Handle connection open
    /*eventSource.onopen = (): void => {};*/

    // Handle connection error
    eventSource.onerror = (error: unknown): void => {
      const err = error as { error?: { message?: string } };
      if (!err.error?.message?.includes('Reconnecting')) {
        console.error('SSE connection error:', error);
      }
    };

    // Handle generic message event (no specific event type)
    eventSource.onmessage = (event: { data: string }): void => {
      subject.next({ data: JSON.parse(event.data) });
    };

    return new UserStream(eventSource, subject);
  }
}
