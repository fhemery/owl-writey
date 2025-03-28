import { Route } from '@angular/router';

import { NovelCreatePageComponent } from './pages/novel-create/novel-create-page.component';
import { NovelEditComponent } from './pages/novel-edit/novel-edit.component';
import { NovelMainPageComponent } from './pages/novel-main/novel-main-page.component';

export const novelsRoutes: Route[] = [
  {
    path: 'new',
    component: NovelCreatePageComponent,
  },
  {
    path: ':id',
    component: NovelMainPageComponent,
    children: [
      {
        path: 'edit',
        component: NovelEditComponent,
      },
    ],
  },
];
