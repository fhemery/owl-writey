import { NovelRole } from '@owl/shared/novels/contracts';
import { v4 as uuidV4 } from 'uuid';

import { NovelChapter } from './chapter/novel-chapter';
import { Novel } from './novel';
import { NovelGeneralInfo } from './novel-general-info';
import { NovelParticipant } from './participants/novel-participant';
import { NovelUniverse } from './universe/novel-universe';

export class NovelBuilder {
  private _id: string;
  private _generalInfo: NovelGeneralInfo;
  private _participants: NovelParticipant[] = [];
  private _chapters: NovelChapter[] = [];
  private _universe: NovelUniverse = new NovelUniverse();

  static New(
    title: string,
    description: string,
    authorId: string,
    authorName: string
  ): NovelBuilder {
    const builder = new NovelBuilder();
    builder._id = uuidV4();
    builder._generalInfo = new NovelGeneralInfo(title, description);
    builder._participants.push(
      new NovelParticipant(authorId, authorName, NovelRole.Author)
    );
    return builder;
  }

  static Existing(
    id: string,
    generalInfo: NovelGeneralInfo,
    authorId: string,
    authorName: string
  ): NovelBuilder {
    const builder = new NovelBuilder();
    builder._id = id;
    builder._generalInfo = generalInfo;
    builder._participants.push(
      new NovelParticipant(authorId, authorName, NovelRole.Author)
    );
    return builder;
  }

  withParticipants(participants: NovelParticipant[]): NovelBuilder {
    this._participants = participants;
    return this;
  }

  withChapters(chapters: NovelChapter[]): NovelBuilder {
    this._chapters = chapters;
    return this;
  }

  withUniverse(universe: NovelUniverse): NovelBuilder {
    this._universe = universe;
    return this;
  }

  build(): Novel {
    return new Novel(
      this._id,
      this._generalInfo,
      this._participants,
      this._chapters,
      this._universe
    );
  }

  private constructor() {
    this._id = uuidV4();
    this._generalInfo = new NovelGeneralInfo('title', 'description');
  }
}
