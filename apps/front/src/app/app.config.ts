import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  effect,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { authInterceptor, FirebaseAuthService } from '@owl/front/auth';
import { appRoutes } from '@owl/ui';

import { environment } from '../../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideAppInitializer(() => {
      const auth = inject(FirebaseAuthService);
      return initializeAuth(auth);
    }),
    importProvidersFrom(
      BrowserAnimationsModule,
      MatSnackBarModule,
      TranslateModule.forRoot()
    ),
  ],
};

export function initializeAuth(
  authService: FirebaseAuthService
): Promise<void> {
  let onResolve: () => void;
  const promise = new Promise<void>((resolve) => {
    onResolve = resolve;
  });
  effect(() => {
    if (authService.isInitialized()) {
      onResolve();
    }
  });

  return promise;
}
