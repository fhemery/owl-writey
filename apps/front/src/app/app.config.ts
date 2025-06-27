import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  effect,
  ErrorHandler,
  importProvidersFrom,
  inject,
  isDevMode,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withComponentInputBinding,
  withDisabledInitialNavigation,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { appRoutes } from '@owl/front/app';
import {
  AUTH_SERVICE,
  authInterceptor,
  AuthService,
  FirebaseAuthService,
} from '@owl/front/auth';
import { ConfigService } from '@owl/front/infra';
import { FrontErrorHandler } from '@owl/front/ui/common';

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      // It seems like the guards fire before the AppInitializer : https://github.com/angular/angular/issues/29828
      // Best way to avoid this is to disable initial navigation here and to perform it in AppComponent
      withDisabledInitialNavigation()
    ),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideAppInitializer(() => {
      const auth = inject(AUTH_SERVICE);
      const config: ConfigService = inject(ConfigService);
      return Promise.all([config.init(environment), initializeAuth(auth)]);
    }),
    importProvidersFrom(
      BrowserAnimationsModule,
      MatSnackBarModule,
      MatDialogModule,
      TranslateModule.forRoot()
    ),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
    {
      provide: AUTH_SERVICE,
      useClass: FirebaseAuthService,
    },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    { provide: ErrorHandler, useClass: FrontErrorHandler },
  ],
};

export function initializeAuth(authService: AuthService): Promise<void> {
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
