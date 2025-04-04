export class NovelNotAuthorException extends Error {
  constructor(novelId: string) {
    super(`User is not author of novel: ${novelId}`);
  }
}
