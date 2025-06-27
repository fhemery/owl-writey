import { generateTextDiff } from '@owl/shared/word-utils';

import {
  NovelBuilder,
  NovelException,
  NovelSceneContentUpdatedEvent,
  NovelSceneContentUpdatedEventData,
} from '../../../lib';

describe('NovelSceneContentUpdatedEvent', () => {
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
          new NovelSceneContentUpdatedEvent(
            {
              sceneId: 'scene-1',
              diff: {
                patches: [],
                stats: {
                  diffWordCount: 0,
                },
              },
            } as unknown as NovelSceneContentUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });

    it('should fail if there is no scene id', () => {
      expect(
        () =>
          new NovelSceneContentUpdatedEvent(
            {
              chapterId: 'chapter-1',
              diff: {
                patches: [],
                stats: {
                  diffWordCount: 0,
                },
              },
            } as unknown as NovelSceneContentUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });

    it('should fail if there is no content', () => {
      expect(
        () =>
          new NovelSceneContentUpdatedEvent(
            {
              chapterId: 'chapter-1',
              sceneId: 'scene-1',
            } as unknown as NovelSceneContentUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });
  });

  describe('applyTo', () => {
    it('should update the scene content', () => {
      const event = new NovelSceneContentUpdatedEvent(
        {
          chapterId: 'chapter-2',
          sceneId: 'scene-2',
          diff: generateTextDiff('', 'Updated Content'),
        },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(updatedNovel.findScene('chapter-2', 'scene-2')?.content).toBe(
        'Updated Content'
      );
    });

    it('should do nothing if chapter does not exist', () => {
      const event = new NovelSceneContentUpdatedEvent(
        {
          chapterId: 'non-existent',
          sceneId: 'scene-2',
          diff: generateTextDiff('', 'Updated Content'),
        },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(updatedNovel.findScene('chapter-2', 'scene-2')?.content).toBe('');
    });

    it('should do nothing if scene does not exist', () => {
      const event = new NovelSceneContentUpdatedEvent(
        {
          chapterId: 'chapter-2',
          sceneId: 'non-existent',
          diff: generateTextDiff('', 'Updated Content'),
        },
        'userId'
      );

      expect(() => event.applyTo(novel)).not.toThrowError(NovelException);
    });
  });
});
