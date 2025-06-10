import { Route } from '@angular/router';

import { NovelChapterPageComponent } from './pages/novel-chapter/novel-chapter-page.component';
import { NovelCharactersPageComponent } from './pages/novel-characters/novel-characters-page.component';
import { NovelCreatePageComponent } from './pages/novel-create/novel-create-page.component';
import { NovelMainPageComponent } from './pages/novel-main/novel-main-page.component';
import { NovelOverviewPageComponent } from './pages/novel-overview/novel-overview-page.component';
import { NovelScenePageComponent } from './pages/novel-scene/novel-scene-page.component';
import { novelSettingsRoutes } from './pages/novel-settings/novel-settings.routes';
import { NovelSettingsPageComponent } from './pages/novel-settings/novel-settings-page.component';

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
        path: 'chapters/:chapterId/scenes/:sceneId',
        component: NovelScenePageComponent,
      },
      {
        path: 'chapters/:chapterId',
        component: NovelChapterPageComponent,
      },
      {
        path: 'characters',
        component: NovelCharactersPageComponent,
      },
      {
        path: 'settings',
        component: NovelSettingsPageComponent,
        children: novelSettingsRoutes,
      },
      {
        path: '',
        component: NovelOverviewPageComponent,
      },
    ],
  },
];
