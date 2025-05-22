import {
  NovelBuilder,
  NovelChapterDeletedEvent,
  NovelException,
} from '../../../lib';

describe('NovelChapterDeletedEvent', () => {
  it('should apply to novel', () => {
    const novel = NovelBuilder.New(
      'title',
      'description',
      'authorId',
      'authorName'
    )
      .build()
      .addChapterAt('1', 'chapter1', 'outline1')
      .addChapterAt('2', 'chapter2', 'outline2');

    const event = new NovelChapterDeletedEvent({ id: '1' }, 'uid');
    const result = event.applyTo(novel);
    expect(result.chapters.length).toBe(1);
    expect(result.chapters[0].id).toBe('2');
  });

  it('should not throw if chapter is not found', () => {
    const novel = NovelBuilder.New(
      'title',
      'description',
      'authorId',
      'authorName'
    )
      .build()
      .addChapterAt('1', 'chapter1', 'outline1');
    const event = new NovelChapterDeletedEvent({ id: 'non-existing' }, 'uid');

    expect(() => event.applyTo(novel)).not.toThrowError();
  });

  it('should throw an error if id is not provided', () => {
    expect(() => new NovelChapterDeletedEvent({ id: '' }, 'uid')).toThrowError(
      NovelException
    );
  });
});
