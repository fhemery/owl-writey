import { ApiResponse, NestTestApplication } from '@owl/back/test-utils';
import {
  GetSettingsResponseDto,
  SetSettingsRequestDto,
} from '@owl/shared/common/contracts';

export class SettingsUtils {
  constructor(private readonly app: NestTestApplication) {}

  addSetting(
    key: string,
    value: string,
    scope: string,
    scopeId?: string
  ): Promise<ApiResponse<void>> {
    return this.app.patch<SetSettingsRequestDto>(`/api/settings`, {
      settings: [{ key, value, scope, scopeId }],
    });
  }

  getSettings(
    scope?: string,
    scopeId?: string
  ): Promise<ApiResponse<GetSettingsResponseDto>> {
    if (!scope) {
      return this.app.get<GetSettingsResponseDto>(`/api/settings`);
    }
    if (!scopeId) {
      return this.app.get<GetSettingsResponseDto>(
        `/api/settings?scope=${scope}`
      );
    }
    return this.app.get<GetSettingsResponseDto>(
      `/api/settings?scope=${scope}&scopeId=${scopeId}`
    );
  }
}
