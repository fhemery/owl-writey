import {
  ApplicationConfig,
  effect,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from '@owl/ui';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor, FirebaseAuthService } from '@owl/front/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '../../environments/environment';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
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

export function initializeAuth(authService: FirebaseAuthService) {
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
