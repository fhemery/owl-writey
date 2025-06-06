import {
  NovelBuilder,
  NovelChapterTitleUpdatedEvent,
  NovelChapterTitleUpdatedEventData,
  NovelException,
} from '../../../lib';

describe('NovelChapterTitleUpdatedEvent', () => {
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
          new NovelChapterTitleUpdatedEvent(
            { title: 'New Title' } as NovelChapterTitleUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });

    it('should fail if there is no title', () => {
      expect(
        () =>
          new NovelChapterTitleUpdatedEvent(
            { id: 'chapter-1' } as NovelChapterTitleUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });

    it('should fail if title is empty', () => {
      expect(
        () =>
          new NovelChapterTitleUpdatedEvent(
            { id: 'chapter-1', title: '' } as NovelChapterTitleUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });
  });

  describe('applyTo', () => {
    it('should update the chapter title', () => {
      const event = new NovelChapterTitleUpdatedEvent(
        { id: 'chapter-1', title: 'Updated Title' },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(updatedNovel.chapters.length).toBe(1);
      expect(updatedNovel.chapters[0].id).toBe('chapter-1');
      expect(updatedNovel.chapters[0].generalInfo.title).toBe('Updated Title');
      expect(updatedNovel.chapters[0].generalInfo.outline).toBe('Outline');
    });

    it('should do nothing if chapter does not exist', () => {
      const event = new NovelChapterTitleUpdatedEvent(
        { id: 'non-existent', title: 'Updated Title' },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(updatedNovel.chapters.length).toBe(1);
      expect(updatedNovel.chapters[0].generalInfo.title).toBe('Chapter 1');
    });
  });
});
