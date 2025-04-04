import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FirebaseAuthService } from '@owl/front/auth';
import { SseEvent } from '@owl/shared/common/contracts';
import { filter, finalize, from, map, Observable, switchMap } from 'rxjs';

import { SseSubscriberService } from './sse.subscriber.service';

@Injectable()
export class UserNotificationsService {
  private auth = inject(FirebaseAuthService);
  private sseSubscriber = inject(SseSubscriberService);
  private user$ = toObservable(this.auth.user);

  connect(url: string): Observable<SseEvent> {
    return from(this.sseSubscriber.connect(url)).pipe(
      switchMap((connection) => {
        return connection.stream.pipe(
          finalize(() => connection.close()),
          map((event) => event.data)
        );
      })
    );
  }

  connectUser(): Observable<SseEvent> {
    return this.user$.pipe(
      filter((user) => !!user),
      map((user) => user.uid),
      switchMap((userId) =>
        from(this.sseSubscriber.connect(`/api/users/${userId}/events`)).pipe(
          switchMap((connection) => {
            return connection.stream.pipe(
              finalize(() => connection.close()),
              map((event) => event.data)
            );
          })
        )
      )
    );
  }
}
