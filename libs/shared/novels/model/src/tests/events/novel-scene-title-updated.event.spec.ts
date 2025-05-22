import {
  NovelBuilder,
  NovelException,
  NovelSceneTitleUpdatedEvent,
  NovelSceneTitleUpdatedEventData,
} from '../../lib';

describe('NovelSceneTitleUpdatedEvent', () => {
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

  describe('static From', () => {
    it('should create a new event', () => {
      const event = NovelSceneTitleUpdatedEvent.From(
        {
          chapterId: 'chapter-1',
          sceneId: 'scene-1',
          title: 'New Title',
        },
        'userId'
      );
      expect(event).toBeInstanceOf(NovelSceneTitleUpdatedEvent);
      expect(event.data.chapterId).toBe('chapter-1');
      expect(event.data.sceneId).toBe('scene-1');
      expect(event.data.title).toBe('New Title');
    });
  });

  describe('error cases', () => {
    it('should fail if there is no chapter id', () => {
      expect(
        () =>
          new NovelSceneTitleUpdatedEvent(
            {
              sceneId: 'scene-1',
              title: 'New Title',
            } as NovelSceneTitleUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });

    it('should fail if there is no scene id', () => {
      expect(
        () =>
          new NovelSceneTitleUpdatedEvent(
            {
              chapterId: 'chapter-1',
              title: 'New Title',
            } as NovelSceneTitleUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });

    it('should fail if there is no title', () => {
      expect(
        () =>
          new NovelSceneTitleUpdatedEvent(
            {
              chapterId: 'chapter-1',
              sceneId: 'scene-1',
            } as NovelSceneTitleUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });

    it('should fail if title is empty', () => {
      expect(
        () =>
          new NovelSceneTitleUpdatedEvent(
            {
              chapterId: 'chapter-1',
              sceneId: 'scene-1',
              title: ' ',
            } as NovelSceneTitleUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });
  });

  describe('applyTo', () => {
    it('should update the scene title', () => {
      const event = new NovelSceneTitleUpdatedEvent(
        { chapterId: 'chapter-2', sceneId: 'scene-2', title: 'Updated Title' },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(
        updatedNovel.findScene('chapter-2', 'scene-2')?.generalInfo.title
      ).toBe('Updated Title');
    });

    it('should do nothing if chapter does not exist', () => {
      const event = new NovelSceneTitleUpdatedEvent(
        {
          chapterId: 'non-existent',
          sceneId: 'scene-2',
          title: 'Updated Title',
        },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(
        updatedNovel.findScene('chapter-2', 'scene-2')?.generalInfo.title
      ).toBe('Scene 2');
    });

    it('should do nothing if scene does not exist', () => {
      const event = new NovelSceneTitleUpdatedEvent(
        {
          chapterId: 'chapter-2',
          sceneId: 'non-existent',
          title: 'Updated Title',
        },
        'userId'
      );

      expect(() => event.applyTo(novel)).not.toThrowError(NovelException);
    });
  });
});
