import { SettingScope } from '@owl/shared/common/contracts';

import { Setting } from '../../model/setting';

export const SettingsRepositoryPort = Symbol('SettingsRepositoryPort');
export interface SettingsRepositoryPort {
  findByScope(scope: SettingScope, scopeId?: string | null): Promise<Setting[]>;

  save(setting: Setting, userId: string): Promise<void>;
}
