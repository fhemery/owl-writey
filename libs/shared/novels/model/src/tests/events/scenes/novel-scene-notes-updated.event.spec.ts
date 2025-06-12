import {
  NovelBuilder,
  NovelException,
  NovelSceneNotesUpdatedEvent,
  NovelSceneNotesUpdatedEventData,
} from '../../../lib';

describe('NovelSceneNotesUpdatedEvent', () => {
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
          new NovelSceneNotesUpdatedEvent(
            {
              sceneId: 'scene-1',
              notes: 'New Notes',
            } as NovelSceneNotesUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });

    it('should fail if there is no scene id', () => {
      expect(
        () =>
          new NovelSceneNotesUpdatedEvent(
            {
              chapterId: 'chapter-1',
              notes: 'New Notes',
            } as NovelSceneNotesUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });
  });

  describe('applyTo', () => {
    it('should update the scene notes', () => {
      const event = new NovelSceneNotesUpdatedEvent(
        {
          chapterId: 'chapter-2',
          sceneId: 'scene-2',
          notes: 'Updated Notes',
        },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(
        updatedNovel.findScene('chapter-2', 'scene-2')?.generalInfo.notes
      ).toBe('Updated Notes');
    });

    it('should do nothing if chapter does not exist', () => {
      const event = new NovelSceneNotesUpdatedEvent(
        {
          chapterId: 'non-existent',
          sceneId: 'scene-2',
          notes: 'Updated Notes',
        },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(
        updatedNovel.findScene('chapter-2', 'scene-2')?.generalInfo.notes
      ).toBeUndefined();
    });

    it('should do nothing if scene does not exist', () => {
      const event = new NovelSceneNotesUpdatedEvent(
        {
          chapterId: 'chapter-2',
          sceneId: 'non-existent',
          notes: 'Updated notes',
        },
        'userId'
      );

      expect(() => event.applyTo(novel)).not.toThrowError(NovelException);
    });
  });
});
