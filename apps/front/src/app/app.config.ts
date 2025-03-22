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
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withComponentInputBinding,
  withDisabledInitialNavigation,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { authInterceptor, FirebaseAuthService } from '@owl/front/auth';
import { ConfigService } from '@owl/front/infra';
import { appRoutes } from '@owl/ui';
import { provideQuillConfig } from 'ngx-quill';

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
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
      const auth = inject(FirebaseAuthService);
      const config = inject(ConfigService);
      return Promise.all([config.init(environment), initializeAuth(auth)]);
    }),
    provideQuillConfig({
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],

          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ direction: 'rtl' }], // text direction

          [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          ['clean'], // remove formatting button
        ],
      },
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
