import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { FirebaseAuthService } from './firebase-auth.service';

export const authGuard = async (): Promise<boolean> => {
  const authService = inject(FirebaseAuthService);
  const router = inject(Router);

  const isLoggedIn = !!authService.user();
  if (!isLoggedIn) {
    await router.navigateByUrl('login');
  }
  return isLoggedIn;
};

export const notAuthGuard = async (): Promise<boolean> => {
  const authService = inject(FirebaseAuthService);
  const router = inject(Router);

  const isLoggedIn = !!authService.user();
  if (isLoggedIn) {
    await router.navigateByUrl('dashboard');
  }
  return !isLoggedIn;
};
