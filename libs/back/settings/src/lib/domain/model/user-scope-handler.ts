import { UserDetails } from '@owl/back/auth';

import { Setting } from './setting';
import {
  SettingScopeErrors,
  SettingScopeHandler,
} from './setting-scope-handler';

export class UserScopeHandler implements SettingScopeHandler {
  static ScopeName = 'user';

  checkSettingUpdate(
    setting: Setting,
    user?: UserDetails
  ): Promise<SettingScopeErrors> {
    const errors: SettingScopeErrors = [];
    if (!user) {
      errors.push('User is not logged');
    }
    if (setting.scopeId !== user?.uid) {
      errors.push('Invalid user id');
    }
    return Promise.resolve(errors);
  }
  checkSettingAccess(
    scopeId?: string,
    user?: UserDetails
  ): Promise<SettingScopeErrors> {
    const errors: SettingScopeErrors = [];
    if (!user) {
      errors.push('User is not logged');
    }
    if (scopeId !== user?.uid) {
      errors.push('Invalid user id');
    }
    return Promise.resolve(errors);
  }
}
