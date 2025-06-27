import { UserDetails } from '@owl/back/auth';
import { Role } from '@owl/shared/common/contracts';

import { Setting } from './setting';
import {
  SettingScopeErrors,
  SettingScopeHandler,
} from './setting-scope-handler';

export class DefaultScopeHandler implements SettingScopeHandler {
  static ScopeName = 'default';

  checkSettingUpdate(
    setting: Setting,
    user?: UserDetails
  ): Promise<SettingScopeErrors> {
    const errors: SettingScopeErrors = [];
    if (setting.scopeId) {
      errors.push('Scope id is not allowed for default scope');
    }
    if (!user?.roles.includes(Role.Admin)) {
      errors.push('User is not admin');
    }
    return Promise.resolve(errors);
  }
  checkSettingAccess(scopeId?: string): Promise<SettingScopeErrors> {
    const errors: SettingScopeErrors = [];
    if (scopeId) {
      errors.push('Scope id is not allowed for default scope');
    }
    return Promise.resolve(errors);
  }
}
