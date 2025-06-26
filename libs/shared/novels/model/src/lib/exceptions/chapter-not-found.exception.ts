export class ChapterNotFoundException extends Error {
  constructor(chapterId: string) {
    super(`Chapter not found ${chapterId}`);
    this.name = 'ChapterNotFoundException';
  }
}
