import { Route } from '@angular/router';
import { authGuard, notAuthGuard } from '@owl/front/auth';

import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { ExerciseNewPageComponent } from './pages/exercise/exercise-new-page.component';
import { ExercisePageComponent } from './pages/exercise/exercise-page.component';
import { ExerciseParticipatePageComponent } from './pages/exercise/exercise-participate-page.component';
import { HomePageComponent } from './pages/home/home-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { LogoutPageComponent } from './pages/logout/logout-page.component';
import { NotFoundPageComponent } from './pages/not-found/not-found-page.component';
import { NovelCreatePageComponent } from './pages/novel/novel-create-page.component';
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
  {
    path: 'exercises',
    canActivate: [authGuard],
    children: [
      {
        path: 'new',
        component: ExerciseNewPageComponent,
      },
      {
        path: ':id/participate',
        component: ExerciseParticipatePageComponent,
      },
      {
        path: ':id',
        component: ExercisePageComponent,
      },
    ],
  },
  {
    path: 'novels',
    canActivate: [authGuard],
    children: [
      {
        path: 'new',
        component: NovelCreatePageComponent,
      },
    ],
  },
];
