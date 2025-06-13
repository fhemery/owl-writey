export interface SetSettingsRequestDto {
  settings: SettingToCreateDto[];
}

export interface SettingToCreateDto {
  key: string;
  scope: 'default' | 'user' | string;
  scopeId?: string;
  value: unknown;
}

export interface GetSettingsRequestDto {
  scope: 'default' | 'user' | string;
  scopeId?: string;
}

export interface GetSettingsResponseDto {
  settings: SettingDto[];
}

export interface SettingDto {
  key: string;
  scope: 'default' | 'user' | string;
  scopeId?: string;
  value: unknown;
}

export type SettingScope = 'default' | 'user' | string;
