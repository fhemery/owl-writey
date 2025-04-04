export class NovelNotFoundException extends Error {
  constructor(novelId: string) {
    super(`Novel not found: ${novelId}`);
  }
}
