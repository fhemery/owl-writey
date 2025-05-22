import {
  NovelBuilder,
  NovelException,
  NovelSceneDeletedEvent,
  NovelSceneDeletedEventData,
} from '../../../lib';

describe('NovelSceneDeletedEvent', () => {
  const novelWithScene = NovelBuilder.New(
    'title',
    'description',
    'authorId',
    'authorName'
  )
    .build()
    .addChapterAt('chapter-1', 'Chapter 1', 'Outline')
    .addSceneAt('chapter-1', 'scene-1', 'Scene Title', 'Scene Outline');

  describe('error cases', () => {
    it('should fail if there is no chapterId', () => {
      expect(
        () =>
          new NovelSceneDeletedEvent(
            {
              sceneId: 'scene-1',
            } as NovelSceneDeletedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });

    it('should fail if there is no sceneId', () => {
      expect(
        () =>
          new NovelSceneDeletedEvent(
            {
              chapterId: 'chapter-1',
            } as NovelSceneDeletedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });
  });

  describe('applyTo', () => {
    it('should delete the scene from the chapter', () => {
      const event = new NovelSceneDeletedEvent(
        {
          chapterId: 'chapter-1',
          sceneId: 'scene-1',
        },
        'userId'
      );

      const updatedNovel = event.applyTo(novelWithScene);

      expect(updatedNovel.chapters[0].scenes.length).toBe(0);
    });

    it('should do nothing if the scene does not exist', () => {
      const event = new NovelSceneDeletedEvent(
        {
          chapterId: 'chapter-1',
          sceneId: 'non-existent-scene',
        },
        'userId'
      );

      const updatedNovel = event.applyTo(novelWithScene);

      expect(updatedNovel.chapters[0].scenes.length).toBe(1);
    });

    it('should do nothing if the chapter does not exist', () => {
      const event = new NovelSceneDeletedEvent(
        {
          chapterId: 'non-existent-chapter',
          sceneId: 'scene-1',
        },
        'userId'
      );

      const updatedNovel = event.applyTo(novelWithScene);

      expect(updatedNovel.chapters[0].scenes.length).toBe(1);
    });
  });
});
