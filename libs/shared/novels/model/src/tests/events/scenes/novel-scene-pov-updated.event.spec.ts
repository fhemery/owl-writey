import {
  NovelBuilder,
  NovelException,
  NovelScenePovUpdatedEvent,
  NovelScenePovUpdatedEventData,
} from '../../../lib';

describe('NovelScenePovUpdatedEvent', () => {
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
    .addSceneAt('chapter-2', 'scene-3', 'Scene 3', 'Outline')
    .addCharacterAt('character-1', 'Character 1', 'Outline');
  describe('error cases', () => {
    it('should fail if there is no chapter id', () => {
      expect(
        () =>
          new NovelScenePovUpdatedEvent(
            {
              sceneId: 'scene-1',
              povId: 'character-1',
            } as NovelScenePovUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });

    it('should fail if there is no scene id', () => {
      expect(
        () =>
          new NovelScenePovUpdatedEvent(
            {
              chapterId: 'chapter-1',
              povId: 'character-1',
            } as NovelScenePovUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });
  });

  describe('applyTo', () => {
    it('should update the scene POV', () => {
      const event = new NovelScenePovUpdatedEvent(
        {
          chapterId: 'chapter-2',
          sceneId: 'scene-2',
          povId: 'character-1',
        },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(
        updatedNovel.findScene('chapter-2', 'scene-2')?.generalInfo.pov
      ).toBe('character-1');
    });

    it('should work if there is no pov id', () => {
      const scene = novel.findScene('chapter-2', 'scene-2');
      if (!scene) {
        expect.fail('Scene not found');
      }
      const newNovel = novel.updateScene('chapter-2', scene.withPov('Bob'));
      const event = new NovelScenePovUpdatedEvent(
        {
          chapterId: 'chapter-2',
          sceneId: 'scene-2',
        } as NovelScenePovUpdatedEventData,
        'userId'
      );

      const updatedNovel = event.applyTo(newNovel);

      expect(
        updatedNovel.findScene('chapter-2', 'scene-2')?.generalInfo.pov
      ).toBeUndefined();
    });

    it('should do nothing if chapter does not exist', () => {
      const event = new NovelScenePovUpdatedEvent(
        {
          chapterId: 'non-existent',
          sceneId: 'scene-2',
          povId: 'character-1',
        },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(
        updatedNovel.findScene('chapter-2', 'scene-2')?.generalInfo.pov
      ).toBeUndefined();
    });

    it('should do nothing if scene does not exist', () => {
      const event = new NovelScenePovUpdatedEvent(
        {
          chapterId: 'chapter-2',
          sceneId: 'non-existent',
          povId: 'character-1',
        },
        'userId'
      );

      expect(() => event.applyTo(novel)).not.toThrowError(NovelException);
    });

    describe('error cases', () => {
      it('should fail if there is no pov does not correspond to any existing character', () => {
        const event = new NovelScenePovUpdatedEvent(
          {
            chapterId: 'chapter-1',
            sceneId: 'scene-1',
            povId: 'non-existent',
          } as NovelScenePovUpdatedEventData,
          'userId'
        );
        expect(() => event.applyTo(novel)).toThrowError(NovelException);
      });
    });
  });
});
