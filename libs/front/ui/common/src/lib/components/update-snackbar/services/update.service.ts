import { inject, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import {
  catchError,
  concat,
  from,
  interval,
  Observable,
  of,
  switchMap,
  timer,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  private readonly updates = inject(SwUpdate);
  updateReady$: Observable<boolean>;

  constructor() {
    if (!this.updates.isEnabled) {
      this.updateReady$ = of(false);
      return;
    }

    const afterFiveSeconds$ = timer(5000);
    const every10Minutes$ = interval(10 * 60 * 1000);
    const everyTenMinutesAfterFirstCheck$ = concat(
      afterFiveSeconds$,
      every10Minutes$
    );

    this.updateReady$ = everyTenMinutesAfterFirstCheck$.pipe(
      switchMap(() => from(this.updates.checkForUpdate())),
      catchError((err: unknown) => {
        console.error(err);
        return of(false);
      })
    );
  }
}
