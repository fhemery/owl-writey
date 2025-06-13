import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { Auth, RequestWithUser } from '@owl/back/auth';
import {
  GetSettingsResponseDto,
  SetSettingsRequestDto,
  SettingToCreateDto,
} from '@owl/shared/common/contracts';

import { SettingsAccessDeniedException } from './domain/model/exceptions/settings-access.exception';
import { Setting } from './domain/model/setting';
import { SettingsService } from './domain/ports';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Patch()
  @Auth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateSettings(
    @Body() body: SetSettingsRequestDto,
    @Req() request: RequestWithUser
  ): Promise<void> {
    try {
      await this.settingsService.setSettings(
        body.settings.map((s) => toSetting(s)),
        request.user
      );
    } catch (error) {
      if (error instanceof SettingsAccessDeniedException) {
        throw new ForbiddenException('Settings access denied');
      }
      throw error;
    }
  }

  @Get()
  async getSettings(
    @Req() request: RequestWithUser,
    @Query('scope') scope: string,
    @Query('scopeId') scopeId?: string
  ): Promise<GetSettingsResponseDto> {
    try {
      const settings = await this.settingsService.getSettings(
        scope,
        scopeId,
        request.user
      );
      return {
        settings: settings.map((s) => toSettingDto(s)),
      };
    } catch (error) {
      if (error instanceof SettingsAccessDeniedException) {
        throw new ForbiddenException('Settings access denied');
      }
      throw error;
    }
  }
}

function toSetting(setting: SettingToCreateDto): Setting {
  return new Setting(
    setting.key,
    setting.value,
    setting.scope,
    setting.scopeId
  );
}

function toSettingDto(setting: Setting): SettingToCreateDto {
  return {
    key: setting.key,
    value: setting.value,
    scope: setting.scope,
    scopeId: setting.scopeId,
  };
}
