import {
  NovelBaseDomainEvent,
  NovelDomainEventFactory,
} from '@owl/shared/novels/model';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NovelEventEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({ type: 'varchar', length: 36 })
  novelId!: string;

  @Column({ type: 'varchar', length: 128 })
  eventName!: string;

  @Column({ type: 'varchar', length: 16 })
  eventVersion!: string;

  @Column({ type: 'json' })
  data!: unknown;

  static From(novelId: string, event: NovelBaseDomainEvent): NovelEventEntity {
    const entity = new NovelEventEntity();
    entity.novelId = novelId;
    entity.eventName = event.eventName;
    entity.eventVersion = event.eventVersion;
    entity.data = event.data;
    return entity;
  }

  toNovelEvent(): NovelBaseDomainEvent {
    return NovelDomainEventFactory.From(
      this.eventName,
      this.eventVersion,
      this.data
    );
  }
}
