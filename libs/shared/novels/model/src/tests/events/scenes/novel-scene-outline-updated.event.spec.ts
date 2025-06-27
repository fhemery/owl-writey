import {
  NovelBuilder,
  NovelException,
  NovelSceneOutlineUpdatedEvent,
  NovelSceneOutlineUpdatedEventData,
} from '../../../lib';

describe('NovelSceneOutlineUpdatedEvent', () => {
  const novel = NovelBuilder.New(
    'title',
    'description',
    'authorId',
    'authorName'
  )
    .build()
    .addChapterAt('chapter-1', 'Chapter 1', 'Outline')
    .addSceneAt('chapter-1', 'scene-1', 'Scene 1', 'Outline')
    .addChapterAt('chapter-2', 'Chapter 2', 'Outline')
    .addSceneAt('chapter-2', 'scene-2', 'Scene 2', 'Outline')
    .addSceneAt('chapter-2', 'scene-3', 'Scene 3', 'Outline');

  describe('error cases', () => {
    it('should fail if there is no chapter id', () => {
      expect(
        () =>
          new NovelSceneOutlineUpdatedEvent(
            {
              sceneId: 'scene-1',
              outline: 'New Outline',
            } as NovelSceneOutlineUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });

    it('should fail if there is no scene id', () => {
      expect(
        () =>
          new NovelSceneOutlineUpdatedEvent(
            {
              chapterId: 'chapter-1',
              outline: 'New Outline',
            } as NovelSceneOutlineUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });

    it('should fail if there is no outline', () => {
      expect(
        () =>
          new NovelSceneOutlineUpdatedEvent(
            {
              chapterId: 'chapter-1',
              sceneId: 'scene-1',
            } as NovelSceneOutlineUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });
  });

  describe('applyTo', () => {
    it('should update the scene outline', () => {
      const event = new NovelSceneOutlineUpdatedEvent(
        {
          chapterId: 'chapter-2',
          sceneId: 'scene-2',
          outline: 'Updated Outline',
        },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(
        updatedNovel.findScene('chapter-2', 'scene-2')?.generalInfo.outline
      ).toBe('Updated Outline');
    });

    it('should do nothing if chapter does not exist', () => {
      const event = new NovelSceneOutlineUpdatedEvent(
        {
          chapterId: 'non-existent',
          sceneId: 'scene-2',
          outline: 'Updated Outline',
        },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(
        updatedNovel.findScene('chapter-2', 'scene-2')?.generalInfo.outline
      ).toBe('Outline');
    });

    it('should do nothing if scene does not exist', () => {
      const event = new NovelSceneOutlineUpdatedEvent(
        {
          chapterId: 'chapter-2',
          sceneId: 'non-existent',
          outline: 'Updated outline',
        },
        'userId'
      );

      expect(() => event.applyTo(novel)).not.toThrowError(NovelException);
    });
  });
});
