import { Column, Entity, PrimaryColumn } from 'typeorm';

import {
  Chapter,
  ChapterGeneralInfo,
  Novel,
  NovelCharacter,
  NovelGeneralInfo,
  NovelParticipant,
  NovelUniverse,
  Scene,
  SceneGeneralInfo,
} from '../../../domain/model';
import { NovelParticipantEntity } from './novel-participant.entity';

@Entity({ name: 'novel_contents' })
export class NovelContentEntity {
  @PrimaryColumn({ type: 'varchar', length: 36, generated: false })
  novelId!: string;

  @Column({ type: 'json' })
  content!: NovelDao;

  static From(novel: Novel): NovelContentEntity {
    const entity = new NovelContentEntity();
    entity.novelId = novel.id;
    entity.content = {
      title: novel.generalInfo.title,
      description: novel.generalInfo.description,
      chapters: novel.chapters.map((c) => ({
        id: c.id,
        title: c.generalInfo.title,
        outline: c.generalInfo.outline,
        scenes: c.scenes.map((s) => ({
          id: s.id,
          title: s.generalInfo.title,
          outline: s.generalInfo.outline,
          content: s.text,
          pointOfView: s.generalInfo.pointOfViewId,
        })),
      })),
      universe: {
        characters: novel.universe.characters.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          tags: c.tags,
        })),
      },
    };
    return entity;
  }

  toNovel(participants: NovelParticipantEntity[]): Novel {
    return new Novel(
      this.novelId,
      new NovelGeneralInfo(
        this.content.title,
        this.content.description,
        participants.map(
          (p) => new NovelParticipant(p.participantUid, p.name, p.role)
        )
      ),
      this.content.chapters.map(
        (c) =>
          new Chapter(
            c.id,
            new ChapterGeneralInfo(c.title, c.outline),
            c.scenes.map(
              (s) =>
                new Scene(
                  s.id,
                  new SceneGeneralInfo(s.title, s.outline, s.pointOfView),
                  s.content
                )
            )
          )
      ),
      new NovelUniverse(
        this.content.universe?.characters.map(
          (c) => new NovelCharacter(c.id, c.name, c.description, c.tags)
        ) || []
      )
    );
  }
}

interface NovelDao {
  title: string;
  description: string;
  chapters: ChapterDao[];
  universe?: UniverseDao;
}

interface ChapterDao {
  id: string;
  title: string;
  outline: string;
  scenes: SceneDao[];
}

interface SceneDao {
  id: string;
  title: string;
  outline: string;
  pointOfView?: string;
  content: string;
}

interface UniverseDao {
  characters: CharacterDao[];
}

interface CharacterDao {
  id: string;
  name: string;
  description: string;
  tags: string[];
}
