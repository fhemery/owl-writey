import { inject, Injectable } from '@angular/core';
import { FirebaseAuthService } from '@owl/front/auth';
import { SseEvent } from '@owl/shared/contracts';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SseSubscriberService {
  private auth = inject(FirebaseAuthService);

  async connect(url: string): Promise<Observable<SseEvent>> {
    const token = await this.auth.getToken();
    const subject = new Subject<SseEvent>();
    const eventSource = new EventSourcePolyfill(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Handle connection open
    eventSource.onopen = (): void => {
      console.log('SSE connection established');
    };

    // Handle connection error
    eventSource.onerror = (error: unknown): void => {
      console.error('SSE connection error:', error);
    };

    // Handle generic message event (no specific event type)
    eventSource.onmessage = (event: { data: string }): void => {
      console.log('Received message:', event.data);
      subject.next(JSON.parse(event.data) as SseEvent);
    };

    return subject;
  }
}
