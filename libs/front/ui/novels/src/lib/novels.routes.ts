import { Route } from '@angular/router';

import { NovelCreatePageComponent } from './pages/novel-create-page.component';
import { NovelPageComponent } from './pages/novel-page.component';

export const novelsRoutes: Route[] = [
  {
    path: 'new',
    component: NovelCreatePageComponent,
  },
  {
    path: ':id',
    component: NovelPageComponent,
  },
];
