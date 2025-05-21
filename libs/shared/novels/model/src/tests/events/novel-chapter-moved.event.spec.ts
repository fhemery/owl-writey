import {
  NovelBuilder,
  NovelChapterMovedData,
  NovelChapterMovedEvent,
  NovelException,
} from '../../lib';

const basicNovel = NovelBuilder.New(
  'title',
  'description',
  'authorId',
  'authorName'
).build();
describe('NovelChapterMovedEvent', () => {
  describe('applyTo', () => {
    it('should move chapter forward properly', () => {
      const novel = basicNovel
        .addChapterAt('1', 'chapter1', 'outline1')
        .addChapterAt('2', 'chapter2', 'outline2')
        .addChapterAt('3', 'chapter3', 'outline3');

      const event = new NovelChapterMovedEvent({ id: '1', atIndex: 2 }, 'uid');
      const result = event.applyTo(novel);
      expect(result.chapters[0].id).toBe('2');
      expect(result.chapters[1].id).toBe('1');
      expect(result.chapters[2].id).toBe('3');
    });

    it('should move chapter backward properly', () => {
      const novel = basicNovel
        .addChapterAt('1', 'chapter1', 'outline1')
        .addChapterAt('2', 'chapter2', 'outline2')
        .addChapterAt('3', 'chapter3', 'outline3');

      const event = new NovelChapterMovedEvent({ id: '2', atIndex: 0 }, 'uid');
      const result = event.applyTo(novel);
      expect(result.chapters[0].id).toBe('2');
      expect(result.chapters[1].id).toBe('1');
      expect(result.chapters[2].id).toBe('3');
    });

    it('should not throw if chapter is not found', () => {
      const novel = basicNovel.addChapterAt('1', 'chapter1', 'outline1');

      const event = new NovelChapterMovedEvent(
        { id: 'non-existing', atIndex: 1 },
        'uid'
      );

      expect(() => event.applyTo(novel)).not.toThrowError();
    });
  });

  describe('error cases', () => {
    it('should throw an error if id is not provided', () => {
      expect(
        () => new NovelChapterMovedEvent({ id: '', atIndex: 1 }, 'uid')
      ).toThrowError(NovelException);
    });
    it('should throw an error if atIndex is not provided', () => {
      expect(
        () =>
          new NovelChapterMovedEvent(
            { id: '1' } as NovelChapterMovedData,
            'uid'
          )
      ).toThrowError(NovelException);
    });

    it('should throw an error if atIndex is negative', () => {
      expect(
        () => new NovelChapterMovedEvent({ id: '1', atIndex: -1 }, 'uid')
      ).toThrowError(NovelException);
    });
  });
});
