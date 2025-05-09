export class NovelException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NovelException';
  }
}
