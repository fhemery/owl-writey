import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { from, Observable, switchMap, take } from 'rxjs';

import { AUTH_SERVICE } from '../auth.service.interface';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AUTH_SERVICE);
  const user = authService.user();
  if (!user) {
    return next(request);
  }

  return from(authService.getToken()).pipe(
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
