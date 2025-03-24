import { Route } from '@angular/router';

import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    component: DashboardPageComponent,
  },
];
