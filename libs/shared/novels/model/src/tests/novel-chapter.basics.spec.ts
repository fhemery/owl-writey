import { NovelBuilder, NovelException } from '../lib';

describe('Novel chapter basics', () => {
  it('should fail if trying to add a chapter with empty name', () => {
    const novel = NovelBuilder.New(
      'title',
      'description',
      'authorId',
      'authorName'
    ).build();
    expect(() => novel.addChapterAt('1', '', 'outline')).toThrowError(
      NovelException
    );
  });

  it('should fail if trying to add a chapter with empty id', () => {
    const novel = NovelBuilder.New(
      'title',
      'description',
      'authorId',
      'authorName'
    ).build();
    expect(() => novel.addChapterAt('', 'chapter', 'outline')).toThrowError(
      NovelException
    );
  });
});
