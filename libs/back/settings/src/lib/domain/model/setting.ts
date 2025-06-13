import { SettingScope } from '@owl/shared/common/contracts';

export class Setting {
  constructor(
    readonly key: string,
    readonly value: unknown,
    readonly scope: SettingScope,
    readonly scopeId?: string
  ) {}
}
