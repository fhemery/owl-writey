import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserDetails } from '@owl/back/auth';
import { SettingScope } from '@owl/shared/common/contracts';

import { UserScopeHandler } from '../../model';
import { DefaultScopeHandler } from '../../model/default-scope-handler';
import { BadSettingRequestException } from '../../model/exceptions/bad-setting-request.exception';
import { Setting } from '../../model/setting';
import {
  SettingScopeErrors,
  SettingScopeHandler,
} from '../../model/setting-scope-handler';
import { SettingsRepositoryPort } from '../out/settings-repository.port';

@Injectable()
export class SettingsService {
  private logger = new Logger(SettingsService.name);
  private readonly scopes: Map<SettingScope, SettingScopeHandler> = new Map();

  constructor(
    @Inject(SettingsRepositoryPort)
    private readonly repository: SettingsRepositoryPort
  ) {
    this.registerSettingScope(
      DefaultScopeHandler.ScopeName,
      new DefaultScopeHandler()
    );
    this.registerSettingScope(
      UserScopeHandler.ScopeName,
      new UserScopeHandler()
    );
  }

  registerSettingScope(
    scope: SettingScope,
    validator: SettingScopeHandler
  ): void {
    this.logger.log(`Registering scope ${scope}`);
    this.scopes.set(scope, validator);
  }

  private getScope(scope: SettingScope): SettingScopeHandler {
    const validator = this.scopes.get(scope);
    if (!validator) {
      console.log('Found no validator');
      throw new BadSettingRequestException(`Scope ${scope} is not allowed`);
    }
    return validator;
  }

  async getSettings(
    scope: SettingScope = 'default',
    scopeId?: string,
    user?: UserDetails
  ): Promise<Setting[]> {
    const errors = await this.getScope(scope).checkSettingAccess(scopeId, user);
    if (errors.length > 0) {
      throw new BadSettingRequestException(errors.join(', '));
    }
    return this.repository.findByScope(scope, scopeId);
  }

  async setSettings(settings: Setting[], user: UserDetails): Promise<void> {
    let errors: SettingScopeErrors = [];
    for (const setting of settings) {
      errors = errors.concat(
        await this.getScope(setting.scope).checkSettingUpdate(setting, user)
      );
    }
    if (errors.length > 0) {
      throw new BadSettingRequestException(errors.join(', '));
    }

    for (const setting of settings) {
      await this.repository.save(setting, user.uid);
    }
    return Promise.resolve();
  }
}
