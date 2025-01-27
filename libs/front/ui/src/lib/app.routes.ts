import { Route } from '@angular/router';
import { authGuard, notAuthGuard } from '@owl/front/auth';

import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { HomePageComponent } from './pages/home/home-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { LogoutPageComponent } from './pages/logout/logout-page.component';
import { RegisterPageComponent } from './pages/register/register-page.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    children: [
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
    ],
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    canActivate: [notAuthGuard],
  },
];
