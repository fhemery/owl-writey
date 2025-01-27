import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { from, Observable, switchMap, take } from 'rxjs';

import { FirebaseAuthService } from './firebase-auth.service';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(FirebaseAuthService);
  const user = authService.user();
  if (!user) {
    return next(request);
  }

  return from(user.getIdToken()).pipe(
    take(1),
    switchMap((token) => {
      if (token) {
        request = request.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
      }
      return next(request);
    })
  );
};
