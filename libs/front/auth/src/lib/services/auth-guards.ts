import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '@owl/shared/common/contracts';

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

const checkRole = async (role: Role): Promise<boolean> => {
  const authService = inject(FirebaseAuthService);
  const router = inject(Router);

  const user = authService.user();
  const isAllowed = !!user && user.roles.includes(role);
  if (!isAllowed) {
    await router.navigateByUrl('/');
  }
  return isAllowed;
};

export const adminOnlyGuard = async (): Promise<boolean> => {
  return checkRole(Role.Admin);
};

export const betaOnlyGuard = async (): Promise<boolean> => {
  return checkRole(Role.Beta);
};
