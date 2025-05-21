import { NovelChapter } from './chapter/novel-chapter';
import { NovelChapters } from './chapter/novel-chapters';
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

  addChapterAt(id: string, name: string, outline = '', index?: number): Novel {
    return this.withChapters(this._chapters.addAt(id, name, outline, index));
  }
  updateChapter(chapter: NovelChapter): void {
    this._chapters.update(chapter);
  }
  moveChapter(chapterIndex: number, toIndex: number): void {
    this._chapters.move(chapterIndex, toIndex);
  }
  deleteChapter(chapterId: string): Novel {
    return this.withChapters(this._chapters.delete(chapterId));
  }
  addSceneAt(
    chapterId: string,
    title: string,
    outline = '',
    index?: number
  ): void {
    this._chapters.addSceneAt(chapterId, title, outline, index);
  }
  updateScene(chapterId: string, scene: NovelScene): void {
    this._chapters.updateScene(chapterId, scene);
  }
  transferScene(
    initialChapterId: string,
    sceneId: string,
    targetChapterId: string,
    sceneIndex: number
  ): void {
    this._chapters.transferScene(
      initialChapterId,
      sceneId,
      targetChapterId,
      sceneIndex
    );
  }
  moveScene(chapterId: string, sceneIndex: number, toIndex: number): void {
    this._chapters.moveScene(chapterId, sceneIndex, toIndex);
  }
  deleteScene(chapterId: string, sceneId: string): void {
    this._chapters.deleteScene(chapterId, sceneId);
  }
  addCharacterAt(name: string, description: string, index: number): void {
    this.universe.addCharacterAt(name, description, index);
  }
  updateCharacter(character: NovelCharacter): void {
    this.universe.updateCharacter(character);
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
  deleteCharacter(id: string): void {
    this.universe.deleteCharacter(id);
    this._chapters.deletePov(id);
  }
  findCharacter(characterId: string): NovelCharacter | null {
    return this.universe.findCharacter(characterId);
  }
  isAuthor(uid: string): boolean {
    return this._participants.isAuthor(uid);
  }
  copy(): Novel {
    return new Novel(
      this.id,
      this.generalInfo.copy(),
      this._participants.participants,
      this._chapters.chapters,
      this.universe.copy()
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
}
