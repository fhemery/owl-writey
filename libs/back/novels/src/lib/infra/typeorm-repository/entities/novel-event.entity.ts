import {
  NovelBaseDomainEvent,
  NovelDomainEventFactory,
} from '@owl/shared/novels/model';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'novel_events' })
export class NovelEventEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({ type: 'varchar', length: 36 })
  novelId!: string;

  @Column({ type: 'varchar', length: 128 })
  eventName!: string;

  @Column({ type: 'varchar', length: 36 })
  eventId!: string;

  @Column({ type: 'varchar', length: 36 })
  userId!: string;

  @Column({ type: 'varchar', length: 16 })
  eventVersion!: string;

  @Column({ type: 'json' })
  data!: unknown;

  static From(novelId: string, event: NovelBaseDomainEvent): NovelEventEntity {
    const entity = new NovelEventEntity();
    entity.novelId = novelId;
    entity.eventName = event.eventName;
    entity.eventVersion = event.eventVersion;
    entity.eventId = event.eventId;
    entity.userId = event.userId;
    entity.data = event.data;
    // We do not map sequential Id, because it is the primary key.
    return entity;
  }

  toNovelEvent(): NovelBaseDomainEvent {
    return NovelDomainEventFactory.From(
      this.eventName,
      this.eventVersion,
      this.data,
      this.userId,
      this.eventId,
      this.id
    );
  }
}
