import { Inject, Injectable } from '@nestjs/common';
import { UserDetails } from '@owl/back/auth';
import { Role, SettingScope } from '@owl/shared/common/contracts';

import { BadSettingRequestException } from '../../model/exceptions/bad-setting-request.exception';
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
    scope: SettingScope = 'default',
    scopeId?: string | null,
    user?: UserDetails
  ): Promise<Setting[]> {
    this.checkRequest(scope, scopeId, user);
    return this.repository.findByScope(scope, scopeId);
  }

  private checkRequest(
    scope: SettingScope,
    scopeId?: string | null,
    user?: UserDetails
  ): void {
    if (!user && scope === 'user') {
      throw new SettingsAccessDeniedException();
    }
    if (scope !== 'default' && !scopeId) {
      throw new BadSettingRequestException(
        'scopeId is required for non default scope'
      );
    }
    if (scope === 'default' && scopeId) {
      throw new BadSettingRequestException(
        'scopeId is not allowed for default scope'
      );
    }
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
