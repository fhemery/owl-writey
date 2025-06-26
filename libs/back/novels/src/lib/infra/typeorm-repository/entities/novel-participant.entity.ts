import { NovelRole } from '@owl/shared/novels/contracts';
import { NovelParticipant } from '@owl/shared/novels/model';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { NovelEntity } from './novel.entity';

@Entity({ name: 'novel_participants' })
export class NovelParticipantEntity {
  @PrimaryColumn({ type: 'varchar', length: 36, generated: false })
  participantUid!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  role!: NovelRole;

  @ManyToOne(() => NovelEntity, (novel) => novel.participants)
  @JoinColumn({ name: 'novelId' })
  novel!: NovelEntity;

  @PrimaryColumn({ name: 'novelId', generated: false })
  novelId!: string;

  static From(
    participant: NovelParticipant,
    novelId: string
  ): NovelParticipantEntity {
    const entity = new NovelParticipantEntity();
    entity.participantUid = participant.uid;
    entity.name = participant.name;
    entity.role = participant.role;
    entity.novelId = novelId;
    return entity;
  }

  toNovelParticipant(): NovelParticipant {
    return new NovelParticipant(this.participantUid, this.name, this.role);
  }
}
