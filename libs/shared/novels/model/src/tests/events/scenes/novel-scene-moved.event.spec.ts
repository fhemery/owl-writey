import {
  NovelBuilder,
  NovelException,
  NovelSceneMovedEvent,
  NovelSceneMovedEventData,
} from '../../../lib';

const basicNovel = NovelBuilder.New(
  'title',
  'description',
  'authorId',
  'authorName'
)
  .build()
  .addChapterAt('chapter-1-id', 'chapter1', 'outline1');
describe('NovelSceneMovedEvent', () => {
  describe('applyTo', () => {
    it('should move scene forward properly', () => {
      const novelWithScenes = basicNovel
        .addSceneAt('chapter-1-id', 'scene-1-id', 'scene1', 'outline1')
        .addSceneAt('chapter-1-id', 'scene-2-id', 'scene2', 'outline2')
        .addSceneAt('chapter-1-id', 'scene-3-id', 'scene3', 'outline3');

      const event = new NovelSceneMovedEvent(
        { chapterId: 'chapter-1-id', sceneId: 'scene-1-id', at: 2 },
        'uid'
      );
      const result = event.applyTo(novelWithScenes);
      expect(result.chapters[0].scenes[0].id).toBe('scene-2-id');
      expect(result.chapters[0].scenes[1].id).toBe('scene-1-id');
      expect(result.chapters[0].scenes[2].id).toBe('scene-3-id');
    });

    it('should move scene backward properly', () => {
      const novelWithScenes = basicNovel
        .addSceneAt('chapter-1-id', 'scene-1-id', 'scene1', 'outline1')
        .addSceneAt('chapter-1-id', 'scene-2-id', 'scene2', 'outline2')
        .addSceneAt('chapter-1-id', 'scene-3-id', 'scene3', 'outline3');

      const event = new NovelSceneMovedEvent(
        { chapterId: 'chapter-1-id', sceneId: 'scene-2-id', at: 0 },
        'uid'
      );
      const result = event.applyTo(novelWithScenes);
      expect(result.chapters[0].scenes[0].id).toBe('scene-2-id');
      expect(result.chapters[0].scenes[1].id).toBe('scene-1-id');
      expect(result.chapters[0].scenes[2].id).toBe('scene-3-id');
    });

    it('should not throw if chapter is not found', () => {
      const novel = basicNovel.addChapterAt('1', 'chapter1', 'outline1');

      const event = new NovelSceneMovedEvent(
        { chapterId: 'non-existing', sceneId: 'scene-1-id', at: 1 },
        'uid'
      );

      expect(() => event.applyTo(novel)).not.toThrowError();
    });

    it('should not throw if scene is not found', () => {
      const novel = basicNovel.addSceneAt(
        'chapter-1-id',
        'scene-1-id',
        'scene1',
        'outline1'
      );

      const event = new NovelSceneMovedEvent(
        { chapterId: 'chapter-1-id', sceneId: 'non-existing', at: 1 },
        'uid'
      );

      expect(() => event.applyTo(novel)).not.toThrowError();
    });
  });

  describe('error cases', () => {
    it('should throw an error if chapterId is not provided', () => {
      expect(
        () =>
          new NovelSceneMovedEvent(
            { sceneId: 'scene-1-id', at: 1 } as NovelSceneMovedEventData,
            'uid'
          )
      ).toThrowError(NovelException);
    });
    it('should throw an error if sceneId is not provided', () => {
      expect(
        () =>
          new NovelSceneMovedEvent(
            { chapterId: 'chapter-1-id', at: 1 } as NovelSceneMovedEventData,
            'uid'
          )
      ).toThrowError(NovelException);
    });
    it('should throw an error if atIndex is not provided', () => {
      expect(
        () =>
          new NovelSceneMovedEvent(
            {
              chapterId: 'chapter-1-id',
              sceneId: 'scene-1-id',
            } as NovelSceneMovedEventData,
            'uid'
          )
      ).toThrowError(NovelException);
    });

    it('should throw an error if atIndex is negative', () => {
      expect(
        () =>
          new NovelSceneMovedEvent(
            {
              chapterId: 'chapter-1-id',
              sceneId: 'scene-1-id',
              at: -1,
            } as NovelSceneMovedEventData,
            'uid'
          )
      ).toThrowError(NovelException);
    });
  });
});
