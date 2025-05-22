import {
  NovelBuilder,
  NovelException,
  NovelSceneAddedEvent,
  NovelSceneAddedEventData,
} from '../../lib';

describe('NovelSceneAddedEvent', () => {
  const basicNovel = NovelBuilder.New(
    'title',
    'description',
    'authorId',
    'authorName'
  ).build();
  const novelWithChapters = basicNovel.addChapterAt(
    'chapter-1',
    'Chapter 1',
    'Outline'
  );

  describe('error cases', () => {
    it('should fail if there is no chapterId', () => {
      expect(
        () =>
          new NovelSceneAddedEvent(
            {
              sceneId: 'scene-1',
              title: 'New Scene',
              outline: 'Scene Outline',
            } as NovelSceneAddedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });

    it('should fail if there is no sceneId', () => {
      expect(
        () =>
          new NovelSceneAddedEvent(
            {
              chapterId: 'chapter-1',
              title: 'New Scene',
              outline: 'Scene Outline',
            } as NovelSceneAddedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });

    it('should fail if there is no title', () => {
      expect(
        () =>
          new NovelSceneAddedEvent(
            {
              chapterId: 'chapter-1',
              sceneId: 'scene-1',
              outline: 'Scene Outline',
            } as NovelSceneAddedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });
  });

  describe('applyTo', () => {
    it('should add a scene to the chapter', () => {
      const event = new NovelSceneAddedEvent(
        {
          chapterId: 'chapter-1',
          sceneId: 'scene-1',
          title: 'New Scene',
          outline: 'Scene Outline',
        },
        'userId'
      );

      const updatedNovel = event.applyTo(novelWithChapters);

      expect(updatedNovel.chapters.length).toBe(1);
      expect(updatedNovel.chapters[0].scenes.length).toBe(1);
      expect(updatedNovel.chapters[0].scenes[0].id).toBe('scene-1');
      expect(updatedNovel.chapters[0].scenes[0].generalInfo.title).toBe(
        'New Scene'
      );
      expect(updatedNovel.chapters[0].scenes[0].generalInfo.outline).toBe(
        'Scene Outline'
      );
      expect(updatedNovel.chapters[0].scenes[0].content).toBe('');
    });

    it('should add a scene at the specified index', () => {
      // First add a scene to the chapter
      const firstEvent = new NovelSceneAddedEvent(
        {
          chapterId: 'chapter-1',
          sceneId: 'scene-1',
          title: 'First Scene',
          outline: 'First Outline',
        },
        'userId'
      );
      const novelWithOneScene = firstEvent.applyTo(novelWithChapters);

      // Now add another scene at index 0
      const secondEvent = new NovelSceneAddedEvent(
        {
          chapterId: 'chapter-1',
          sceneId: 'scene-2',
          title: 'Second Scene',
          outline: 'Second Outline',
          at: 0,
        },
        'userId'
      );
      const updatedNovel = secondEvent.applyTo(novelWithOneScene);

      expect(updatedNovel.chapters[0].scenes.length).toBe(2);
      expect(updatedNovel.chapters[0].scenes[0].id).toBe('scene-2');
      expect(updatedNovel.chapters[0].scenes[1].id).toBe('scene-1');
    });

    it('should do nothing if chapter does not exist', () => {
      const event = new NovelSceneAddedEvent(
        {
          chapterId: 'non-existent',
          sceneId: 'scene-1',
          title: 'New Scene',
          outline: 'Scene Outline',
        },
        'userId'
      );

      const updatedNovel = event.applyTo(novelWithChapters);

      expect(updatedNovel.chapters[0].scenes.length).toBe(0);
    });
  });
});
