import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingScope } from '@owl/shared/common/contracts';
import { Repository } from 'typeorm';

import { Setting } from '../../../domain/model/setting';
import { SettingsRepositoryPort } from '../../../domain/ports';
import { SettingsEntity } from './entities/setting.entity';

@Injectable()
export class TypeORMSettingRepository implements SettingsRepositoryPort {
  constructor(
    @InjectRepository(SettingsEntity)
    private readonly repository: Repository<SettingsEntity>
  ) {}

  async findByScope(
    scope: SettingScope,
    scopeId?: string | null
  ): Promise<Setting[]> {
    console.log('Want to fetch', scope, scopeId);
    let entities: SettingsEntity[];
    if (scopeId) {
      entities = await this.repository.find({ where: { scope, scopeId } });
    } else {
      entities = await this.repository.find({ where: { scope } });
    }
    console.log('Fetched', entities.length);
    return entities.map((entity) => entity.toSetting());
  }

  async save(setting: Setting, userId: string): Promise<void> {
    let settingEntity = await this.repository.findOne({
      where: {
        key: setting.key,
        scope: setting.scope,
        scopeId: setting.scopeId,
      },
    });
    if (settingEntity) {
      settingEntity.value = setting.value;
      settingEntity.updatedAt = new Date();
      settingEntity.updatedBy = userId;
    } else {
      settingEntity = SettingsEntity.From(setting, userId);
    }
    await this.repository.save(settingEntity);
    console.log('Saved', JSON.stringify(settingEntity));
  }
}
