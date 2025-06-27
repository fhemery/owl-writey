import { Route } from '@angular/router';

import { ProfileHomePageComponent } from './pages/profile-home/profile-home-page.component';

export const profileRoutes: Route[] = [
  {
    path: '',
    component: ProfileHomePageComponent,
  },
];
