import { InjectionToken, Signal } from '@angular/core';

import { User } from './model/user';

export const AUTH_SERVICE = new InjectionToken<AuthService>('AuthService');

export interface AuthService {
  isLoginEnabled: boolean;
  isInitialized: Signal<boolean>;
  user: Signal<User | null>;
  login(login: string, password: string): Promise<boolean>;
  logout(): Promise<void>;
  register(login: string, password: string): Promise<boolean>;
  getToken(): Promise<string | undefined>;
}
