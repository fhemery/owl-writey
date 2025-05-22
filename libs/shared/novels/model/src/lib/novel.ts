import { NovelChapter } from './chapter/novel-chapter';
import { NovelChapters } from './chapter/novel-chapters';
import { NovelException } from './exceptions/novel.exception';
import { NovelGeneralInfo } from './novel-general-info';
import { NovelParticipant } from './participants/novel-participant';
import { NovelParticipants } from './participants/novel-participants';
import { NovelScene } from './scene/novel-scene';
import { NovelCharacter } from './universe/novel-character';
import { NovelUniverse } from './universe/novel-universe';

export class Novel {
  private _chapters: NovelChapters;
  private _participants: NovelParticipants;

  constructor(
    readonly id: string,
    readonly generalInfo: NovelGeneralInfo,
    participants: NovelParticipant[] = [],
    chapters: NovelChapter[] = [],
    readonly universe: NovelUniverse = new NovelUniverse()
  ) {
    this._chapters = new NovelChapters(chapters);

    this._participants = new NovelParticipants(participants);
  }

  get chapters(): NovelChapter[] {
    return this._chapters.chapters;
  }

  get participants(): NovelParticipant[] {
    return this._participants.participants;
  }

  isAuthor(uid: string): boolean {
    return this._participants.isAuthor(uid);
  }

  addChapterAt(id: string, name: string, outline = '', index?: number): Novel {
    return this.withChapters(this._chapters.addAt(id, name, outline, index));
  }
  updateChapter(chapter: NovelChapter): Novel {
    return this.withChapters(this._chapters.update(chapter));
  }
  findChapter(id: string): NovelChapter | null {
    return this._chapters.findChapter(id);
  }
  findScene(chapterId: string, sceneId: string): NovelScene | null {
    return this._chapters.findScene(chapterId, sceneId);
  }
  moveChapter(chapterId: string, atIndex: number): Novel {
    return this.withChapters(this._chapters.move(chapterId, atIndex));
  }
  deleteChapter(chapterId: string): Novel {
    return this.withChapters(this._chapters.delete(chapterId));
  }
  addSceneAt(
    chapterId: string,
    sceneId: string,
    title: string,
    outline = '',
    index?: number
  ): Novel {
    return this.withChapters(
      this._chapters.addSceneAt(chapterId, sceneId, title, outline, index)
    );
  }
  updateScene(chapterId: string, scene: NovelScene): Novel {
    return this.withChapters(this._chapters.updateScene(chapterId, scene));
  }
  transferScene(
    initialChapterId: string,
    sceneId: string,
    targetChapterId: string,
    sceneIndex: number
  ): Novel {
    return this.withChapters(
      this._chapters.transferScene(
        initialChapterId,
        sceneId,
        targetChapterId,
        sceneIndex
      )
    );
  }
  moveScene(chapterId: string, sceneId: string, at: number): Novel {
    return this.withChapters(this._chapters.moveScene(chapterId, sceneId, at));
  }

  deleteScene(chapterId: string, sceneId: string): Novel {
    return this.withChapters(this._chapters.deleteScene(chapterId, sceneId));
  }
  addCharacterAt(
    id: string,
    name: string,
    description: string,
    index?: number
  ): Novel {
    return this.withUniverse(
      this.universe.addCharacterAt(id, name, description, index)
    );
  }

  updateCharacter(character: NovelCharacter): Novel {
    return this.withUniverse(this.universe.updateCharacter(character));
  }
  updateTitle(title: string): Novel {
    return this.withGeneralInfo(this.generalInfo.withTitle(title));
  }
  updateDescription(description: string): Novel {
    return this.withGeneralInfo(this.generalInfo.withDescription(description));
  }
  moveCharacter(from: number, to: number): void {
    this.universe.moveCharacter(from, to);
  }
  doMoveCharacter(characterId: string, toIndex: number): Novel {
    return this.withUniverse(
      this.universe.doMoveCharacter(characterId, toIndex)
    );
  }
  deleteCharacter(id: string): Novel {
    return this.withChapters(this._chapters.removePov(id)).withUniverse(
      this.universe.deleteCharacter(id)
    );
  }
  findCharacter(characterId: string): NovelCharacter | null {
    return this.universe.findCharacter(characterId);
  }
  updateScenePov(chapterId: string, sceneId: string, povId?: string): Novel {
    if (povId && !this.findCharacter(povId)) {
      throw new NovelException('Character not found');
    }
    const scene = this.findScene(chapterId, sceneId);
    if (!scene) {
      return this;
    }
    return this.withChapters(
      this._chapters.updateScene(chapterId, scene.withPov(povId))
    );
  }

  private withGeneralInfo(generalInfo: NovelGeneralInfo): Novel {
    return new Novel(
      this.id,
      generalInfo,
      this.participants,
      this.chapters,
      this.universe
    );
  }

  private withChapters(chapters: NovelChapters): Novel {
    return new Novel(
      this.id,
      this.generalInfo,
      this.participants,
      chapters.chapters,
      this.universe
    );
  }
  private withUniverse(universe: NovelUniverse): Novel {
    return new Novel(
      this.id,
      this.generalInfo,
      this.participants,
      this.chapters,
      universe
    );
  }
}
