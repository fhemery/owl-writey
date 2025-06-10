import { Route } from '@angular/router';

import { NovelSettingsExportPageComponent } from '../novel-settings-export/novel-settings-export-page.component';
import { NovelSettingsGeneralInfoPageComponent } from '../novel-settings-general-info/novel-settings-general-info-page.component';

export const novelSettingsRoutes: Route[] = [
  {
    path: '',
    component: NovelSettingsGeneralInfoPageComponent,
  },
  {
    path: 'export',
    component: NovelSettingsExportPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
