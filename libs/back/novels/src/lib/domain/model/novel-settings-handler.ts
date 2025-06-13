import { UserDetails } from '@owl/back/auth';
import {
  Setting,
  SettingScopeErrors,
  SettingScopeHandler,
} from '@owl/back/settings';

import { GetNovelQuery } from '../ports';

export class NovelSettingsHandler implements SettingScopeHandler {
  constructor(private readonly getNovelQuery: GetNovelQuery) {}

  async checkSettingUpdate(
    setting: Setting,
    user?: UserDetails
  ): Promise<SettingScopeErrors> {
    if (!setting.scopeId) {
      return ['Novel id is required'];
    }
    if (!user) {
      return ['User is required'];
    }
    const novel = await this.getNovelQuery.execute(setting.scopeId, user.uid);
    if (!novel) {
      return ['Novel not found'];
    }
    if (!novel.isAuthor(user.uid)) {
      return ['User is not owner of the novel'];
    }
    return [];
  }
  async checkSettingAccess(
    scopeId?: string,
    user?: UserDetails
  ): Promise<SettingScopeErrors> {
    if (!scopeId) {
      return ['Novel id is required'];
    }
    if (!user) {
      return ['User is required'];
    }
    const novel = await this.getNovelQuery.execute(scopeId, user.uid);
    if (!novel) {
      return ['Novel not found'];
    }
    if (!novel.hasParticipant(user.uid)) {
      return ['User is not participant of the novel'];
    }
    return [];
  }
}
