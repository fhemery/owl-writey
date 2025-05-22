import {
  NovelBuilder,
  NovelChapterOutlineUpdatedEvent,
  NovelChapterOutlineUpdatedEventData,
  NovelException,
} from '../../lib';

describe('NovelChapterOutlineUpdatedEvent', () => {
  const novel = NovelBuilder.New(
    'title',
    'description',
    'authorId',
    'authorName'
  )
    .build()
    .addChapterAt('chapter-1', 'Chapter 1', 'Outline');

  describe('error cases', () => {
    it('should fail if there is no id', () => {
      expect(
        () =>
          new NovelChapterOutlineUpdatedEvent(
            { outline: 'New Outline' } as NovelChapterOutlineUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });

    it('should fail if there is no outline', () => {
      expect(
        () =>
          new NovelChapterOutlineUpdatedEvent(
            { id: 'chapter-1' } as NovelChapterOutlineUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });
  });

  describe('applyTo', () => {
    it('should update the chapter outline', () => {
      const event = new NovelChapterOutlineUpdatedEvent(
        { id: 'chapter-1', outline: 'Updated Outline' },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(updatedNovel.chapters.length).toBe(1);
      expect(updatedNovel.chapters[0].id).toBe('chapter-1');
      expect(updatedNovel.chapters[0].generalInfo.outline).toBe(
        'Updated Outline'
      );
      expect(updatedNovel.chapters[0].generalInfo.title).toBe('Chapter 1');
    });

    it('should do nothing if chapter does not exist', () => {
      const event = new NovelChapterOutlineUpdatedEvent(
        { id: 'non-existent', outline: 'Updated Outline' },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(updatedNovel.chapters.length).toBe(1);
      expect(updatedNovel.chapters[0].generalInfo.outline).toBe('Outline');
    });
  });
});
