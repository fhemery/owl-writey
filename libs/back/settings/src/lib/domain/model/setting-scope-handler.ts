import { UserDetails } from '@owl/back/auth';

import { Setting } from '../model';

export type SettingScopeErrors = string[];

export interface SettingScopeHandler {
  checkSettingUpdate(setting: Setting, user?: UserDetails): SettingScopeErrors;
  checkSettingAccess(scopeId?: string, user?: UserDetails): SettingScopeErrors;
}
