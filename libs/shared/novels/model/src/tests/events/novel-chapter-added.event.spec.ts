import {
  NovelBuilder,
  NovelChapterAddedEvent,
  NovelException,
} from '../../lib';

const basicNovel = NovelBuilder.New(
  'title',
  'description',
  'authorId',
  'authorName'
).build();

describe('NovelChapterAddedEvent', () => {
  describe('applyTo', () => {
    it('should apply to a novel', () => {
      const event = new NovelChapterAddedEvent(
        { id: '1', name: 'new', outline: 'outline', at: 0 },
        'userId'
      );

      const newNovel = event.applyTo(basicNovel);
      expect(newNovel.chapters.length).toBe(1);
      expect(newNovel.chapters[0].generalInfo.title).toBe('new');
      expect(newNovel.chapters[0].generalInfo.outline).toBe('outline');
    });

    it('should place chapter at the end if at is too big', () => {
      const novel = basicNovel.addChapterAt('1', 'chapter', 'outline');

      const event = new NovelChapterAddedEvent(
        { id: '2', name: 'new', outline: 'outline', at: 2 },
        'userId'
      );
      const newNovel = event.applyTo(novel);
      expect(newNovel.chapters[1].generalInfo.title).toBe('new');
    });

    it('should place chapter at the beginning if at is negative', () => {
      const novel = basicNovel.addChapterAt('1', 'chapter', 'outline');

      const event = new NovelChapterAddedEvent(
        { id: '2', name: 'new', outline: 'outline', at: -1 },
        'userId'
      );
      const newNovel = event.applyTo(novel);
      expect(newNovel.chapters[0].generalInfo.title).toBe('new');
    });

    describe('errorCases', () => {
      it('should fail if name is empty', () => {
        expect(
          () =>
            new NovelChapterAddedEvent(
              { id: '1', name: '', outline: 'outline', at: 0 },
              'userId'
            )
        ).toThrowError(NovelException);
      });

      it('should fail if id is empty', () => {
        expect(
          () =>
            new NovelChapterAddedEvent(
              { id: '', name: 'new', outline: 'outline', at: 0 },
              'userId'
            )
        ).toThrowError(NovelException);
      });
    });
  });
});
