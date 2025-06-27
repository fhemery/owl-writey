import { SettingScope } from '@owl/shared/common/contracts';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { Setting } from '../../../../domain/model/setting';

@Entity('settings')
@Index(['key', 'scope', 'scopeId'], { unique: true })
@Index(['scope', 'scopeId'])
export class SettingsEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: string;

  @Column()
  key!: string;

  @Column({ type: 'varchar', length: 20 })
  scope!: SettingScope;

  @Column({ nullable: true })
  scopeId?: string;

  @Column('json')
  value!: unknown;

  @Column({ type: 'datetime' })
  updatedAt!: Date;

  @Column()
  updatedBy!: string;

  static From(setting: Setting, updatedBy: string): SettingsEntity {
    const entity = new SettingsEntity();
    entity.key = setting.key;
    entity.scope = setting.scope;
    entity.scopeId = setting.scopeId;
    entity.value = setting.value;
    entity.updatedAt = new Date();
    entity.updatedBy = updatedBy;
    return entity;
  }

  toSetting(): Setting {
    return new Setting(this.key, this.value, this.scope, this.scopeId);
  }
}
