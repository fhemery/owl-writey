import { Inject, Injectable } from '@nestjs/common';
import { UserDetails } from '@owl/back/auth';
import { Role, SettingScope } from '@owl/shared/common/contracts';

import { SettingsAccessDeniedException } from '../../model/exceptions/settings-access.exception';
import { Setting } from '../../model/setting';
import { SettingsRepositoryPort } from '../out/settings-repository.port';

@Injectable()
export class SettingsService {
  constructor(
    @Inject(SettingsRepositoryPort)
    private readonly repository: SettingsRepositoryPort
  ) {}

  async getSettings(
    scope: SettingScope,
    scopeId?: string | null,
    user?: UserDetails
  ): Promise<Setting[]> {
    if (!user && scope === 'user') {
      throw new SettingsAccessDeniedException();
    }
    return this.repository.findByScope(scope, scopeId);
  }

  async setSettings(settings: Setting[], user: UserDetails): Promise<void> {
    this.validateSettings(settings, user);
    for (const setting of settings) {
      await this.repository.save(setting, user.uid);
    }
    return Promise.resolve();
  }

  private validateSettings(settings: Setting[], user: UserDetails): void {
    settings.forEach((setting) => {
      switch (setting.scope) {
        case 'default':
          if (!user.roles.includes(Role.Admin)) {
            throw new SettingsAccessDeniedException();
          }
          break;
        case 'user':
          if (setting.scopeId !== user.uid) {
            throw new SettingsAccessDeniedException();
          }
          break;
        default:
          break;
      }
    });
  }
}
