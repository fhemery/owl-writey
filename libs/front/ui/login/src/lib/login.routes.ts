import { Route } from '@angular/router';
import { authGuard, notAuthGuard } from '@owl/front/auth';

import { LoginPageComponent } from './login/login-page.component';
import { LogoutPageComponent } from './logout/logout-page.component';

export const loginRoutes: Route[] = [
  {
    path: '',
    component: LoginPageComponent,
    canActivate: [notAuthGuard],
  },
  {
    path: 'logout',
    component: LogoutPageComponent,
    canActivate: [authGuard],
  },
];
