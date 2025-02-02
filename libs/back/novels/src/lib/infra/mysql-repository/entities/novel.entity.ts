import { Column, Entity, PrimaryColumn } from 'typeorm';

import { Novel, NovelGeneralInfo } from '../../../domain/model';

@Entity('novels')
export class NovelEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', length: 36 })
  authorUid!: string;

  static From(novel: Novel): NovelEntity {
    const entity = new NovelEntity();
    entity.id = novel.id;
    entity.title = novel.generalInfo.title;
    entity.description = novel.generalInfo.description;
    entity.authorUid = novel.generalInfo.authorUid;
    return entity;
  }

  toNovel(): Novel {
    return new Novel(
      this.id,
      new NovelGeneralInfo(this.title, this.description, this.authorUid),
      []
    );
  }
}
