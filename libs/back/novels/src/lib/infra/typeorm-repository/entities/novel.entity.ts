import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { Novel, NovelGeneralInfo, NovelUniverse } from '../../../domain/model';
import { NovelParticipantEntity } from './novel-participant.entity';

@Entity({ name: 'novels' })
export class NovelEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @OneToMany(() => NovelParticipantEntity, (participant) => participant.novel, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  participants!: NovelParticipantEntity[];

  static From(novel: Novel): NovelEntity {
    const entity = new NovelEntity();
    entity.id = novel.id;
    entity.title = novel.generalInfo.title;
    entity.description = novel.generalInfo.description;
    entity.participants = novel.generalInfo.participants.map((participant) =>
      NovelParticipantEntity.From(participant, novel.id)
    );
    return entity;
  }

  toNovel(): Novel {
    return new Novel(
      this.id,
      new NovelGeneralInfo(
        this.title,
        this.description,
        this.participants.map((participant) => participant.toNovelParticipant())
      ),
      [],
      new NovelUniverse()
    );
  }
}
