import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, tap } from 'rxjs';

import { AuthService } from './auth.service';

export const redirectUnauthorizedTo =
  (path: string): CanActivateFn =>
  () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isLoggedIn$.pipe(
      tap((isLoggedIn) => {
        if (!isLoggedIn) {
          router.navigateByUrl(path);
        }
      })
    );
  };

export const redirectLoggedInTo =
  (path: string): CanActivateFn =>
  () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isLoggedIn$.pipe(
      tap((isLoggedIn) => {
        if (isLoggedIn) {
          router.navigateByUrl(path);
        }
      }),
      map((isLoggedIn) => !isLoggedIn)
    );
  };
