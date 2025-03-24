import { Route } from '@angular/router';

import { ExerciseNewPageComponent } from './pages/new/exercise-new-page.component';
import { ExerciseParticipatePageComponent } from './pages/participate/exercise-participate-page.component';
import { ExercisePageComponent } from './pages/view/exercise-page.component';

export const exercisesRoutes: Route[] = [
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
];
