import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FirebaseAuthService } from '@owl/front/auth';
import { SseEvent } from '@owl/shared/contracts';
import { filter, from, map, Observable, switchMap } from 'rxjs';

import { SseSubscriberService } from './sse.subscriber.service';

@Injectable()
export class UserNotificationsService {
  private auth = inject(FirebaseAuthService);
  private sseSubscriber = inject(SseSubscriberService);
  private user$ = toObservable(this.auth.user);

  connect(url: string): Observable<SseEvent> {
    return from(this.sseSubscriber.connect(url)).pipe(
      switchMap((events) => events)
    );
  }

  connectUser(): Observable<SseEvent> {
    return this.user$.pipe(
      filter((user) => !!user),
      map((user) => user.uid),
      switchMap((userId) =>
        from(this.sseSubscriber.connect(`/api/users/${userId}/events`))
      ),
      switchMap((events) => events)
    );
  }
}
