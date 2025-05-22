import {
  NovelBuilder,
  NovelException,
  NovelSceneTransferedEvent,
  NovelSceneTransferedEventData,
} from '../../lib';

const novel = NovelBuilder.New('title', 'description', 'authorId', 'authorName')
  .build()
  .addChapterAt('chapter-1-id', 'chapter1', 'outline1')
  .addSceneAt('chapter-1-id', 'scene-1-id', 'scene1', 'outline1')
  .addSceneAt('chapter-1-id', 'scene-2-id', 'scene2', 'outline2')
  .addChapterAt('chapter-2-id', 'chapter2', 'outline2')
  .addSceneAt('chapter-2-id', 'scene-3-id', 'scene3', 'outline3');
describe('NovelSceneTransferedEvent', () => {
  describe('applyTo', () => {
    it('should move remove scene from one chapter and add it to another chapter', () => {
      const event = new NovelSceneTransferedEvent(
        {
          initialChapterId: 'chapter-1-id',
          sceneId: 'scene-1-id',
          targetChapterId: 'chapter-2-id',
          at: 0,
        },
        'uid'
      );
      const result = event.applyTo(novel);
      expect(result.chapters[0].scenes.length).toBe(1);
      expect(result.chapters[0].scenes[0].id).toBe('scene-2-id');
      expect(result.chapters[1].scenes.length).toBe(2);
      expect(result.chapters[1].scenes[0].id).toBe('scene-1-id');
      expect(result.chapters[1].scenes[1].id).toBe('scene-3-id');
    });

    it('should should take index into account', () => {
      const event = new NovelSceneTransferedEvent(
        {
          initialChapterId: 'chapter-1-id',
          sceneId: 'scene-2-id',
          targetChapterId: 'chapter-2-id',
          at: 2,
        },
        'uid'
      );
      const result = event.applyTo(novel);
      expect(result.chapters[1].scenes.map((s) => s.id)).toEqual([
        'scene-3-id',
        'scene-2-id',
      ]);
    });

    it('should not throw if initial chapter is not found', () => {
      const event = new NovelSceneTransferedEvent(
        {
          initialChapterId: 'non-existing',
          sceneId: 'scene-1-id',
          targetChapterId: 'chapter-2-id',
          at: 1,
        },
        'uid'
      );

      expect(() => event.applyTo(novel)).not.toThrowError();
    });

    it('should not throw if scene is not found', () => {
      const event = new NovelSceneTransferedEvent(
        {
          initialChapterId: 'chapter-1-id',
          sceneId: 'non-existing',
          targetChapterId: 'chapter-2-id',
          at: 1,
        },
        'uid'
      );

      expect(() => event.applyTo(novel)).not.toThrowError();
    });

    it('should not throw if target chapter is not found', () => {
      const event = new NovelSceneTransferedEvent(
        {
          initialChapterId: 'chapter-1-id',
          sceneId: 'scene-1-id',
          targetChapterId: 'non-existing',
          at: 1,
        },
        'uid'
      );

      expect(() => event.applyTo(novel)).not.toThrowError();
    });
  });

  describe('error cases', () => {
    it('should throw an error if initialChapterId is not provided', () => {
      expect(
        () =>
          new NovelSceneTransferedEvent(
            {
              sceneId: 'scene-1-id',
              targetChapterId: 'chapter-2-id',
              at: 1,
            } as NovelSceneTransferedEventData,
            'uid'
          )
      ).toThrowError(NovelException);
    });
    it('should throw an error if sceneId is not provided', () => {
      expect(
        () =>
          new NovelSceneTransferedEvent(
            {
              initialChapterId: 'chapter-1-id',
              targetChapterId: 'chapter-2-id',
              at: 1,
            } as NovelSceneTransferedEventData,
            'uid'
          )
      ).toThrowError(NovelException);
    });
    it('should throw an error if targetChapterId is not provided', () => {
      expect(
        () =>
          new NovelSceneTransferedEvent(
            {
              initialChapterId: 'chapter-1-id',
              sceneId: 'scene-1-id',
              at: 1,
            } as NovelSceneTransferedEventData,
            'uid'
          )
      ).toThrowError(NovelException);
    });

    it('should throw an error if atIndex in not defined', () => {
      expect(
        () =>
          new NovelSceneTransferedEvent(
            {
              initialChapterId: 'chapter-1-id',
              sceneId: 'scene-1-id',
              targetChapterId: 'chapter-2-id',
            } as NovelSceneTransferedEventData,
            'uid'
          )
      ).toThrowError(NovelException);
    });

    it('should throw an error if atIndex is negative', () => {
      expect(
        () =>
          new NovelSceneTransferedEvent(
            {
              initialChapterId: 'chapter-1-id',
              sceneId: 'scene-1-id',
              targetChapterId: 'chapter-2-id',
              at: -1,
            } as NovelSceneTransferedEventData,
            'uid'
          )
      ).toThrowError(NovelException);
    });
  });
});
