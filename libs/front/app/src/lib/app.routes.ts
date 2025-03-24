import { Route } from '@angular/router';
import { authGuard, betaOnlyGuard, notAuthGuard } from '@owl/front/auth';

import { HomePageComponent } from './pages/home/home-page.component';
import { NotFoundPageComponent } from './pages/not-found/not-found-page.component';

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
    loadChildren: () =>
      import('@owl/front/ui/login').then((m) => m.loginRoutes),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('@owl/front/ui/register').then((m) => m.registerRoutes),
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
  {
    path: '**',
    component: NotFoundPageComponent,
    pathMatch: 'full',
  },
];
