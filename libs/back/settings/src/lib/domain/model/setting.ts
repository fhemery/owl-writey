import { SettingScope } from '@owl/shared/common/contracts';

import { BadSettingException } from './exceptions/bad-setting.exception';

export class Setting {
  constructor(
    readonly key: string,
    readonly value: unknown,
    readonly scope: SettingScope,
    readonly scopeId?: string
  ) {
    if (scope !== 'default' && !scopeId) {
      throw new BadSettingException('scopeId is required');
    }
    if (scope === 'default' && scopeId) {
      throw new BadSettingException('scopeId is not allowed for default scope');
    }
  }
}
