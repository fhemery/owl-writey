import { Route } from '@angular/router';

import { NovelSettingsGeneralInfoPageComponent } from '../novel-settings-general-info/novel-settings-general-info-page.component';

export const novelSettingsRoutes: Route[] = [
  {
    path: '',
    component: NovelSettingsGeneralInfoPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
