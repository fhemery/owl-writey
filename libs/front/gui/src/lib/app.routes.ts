import { Route } from '@angular/router';
import { authGuard, betaOnlyGuard, notAuthGuard } from '@owl/front/auth';

import { HomePageComponent } from './pages/home/home-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { LogoutPageComponent } from './pages/logout/logout-page.component';
import { NotFoundPageComponent } from './pages/not-found/not-found-page.component';
import { RegisterPageComponent } from './pages/register/register-page.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: '404',
    component: NotFoundPageComponent,
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('@owl/front/ui/dashboard').then((m) => m.dashboardRoutes),
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
  {
    path: 'exercises',
    canActivate: [authGuard],
    loadChildren: () =>
      import('@owl/front/ui/exercises').then((m) => m.exercisesRoutes),
  },
  {
    path: 'novels',
    loadChildren: () =>
      import('@owl/front/ui/novels').then((m) => m.novelsRoutes),
    canActivate: [betaOnlyGuard],
  },
];
