import { TestUserBuilder } from '@owl/back/test-utils';
import { TrackingEvent } from '@owl/back/tracking';
import { NovelDto } from '@owl/shared/novels/contracts';
import {
  NovelBaseDomainEvent,
  NovelChapterAddedEvent,
  NovelChapterDeletedEvent,
  NovelCharacterAddedEvent,
  NovelCharacterColorUpdatedEvent,
  NovelCharacterDeletedEvent,
  NovelCharacterTagsUpdatedEvent,
  NovelSceneAddedEvent,
  NovelSceneContentUpdatedEvent,
  NovelSceneDeletedEvent,
} from '@owl/shared/novels/model';
import { generateTextDiff } from '@owl/shared/word-utils';

import {
  NovelChapterAddedTrackingEvent,
  NovelChapterDeletedTrackingEvent,
  NovelCharacterAddedTrackingEvent,
  NovelCharacterColorChangedTrackingEvent,
  NovelCharacterDeletedTrackingEvent,
  NovelCharacterTagsChangedTrackingEvent,
  NovelSceneAddedTrackingEvent,
  NovelSceneContentUpdatedTrackingEvent,
  NovelSceneDeletedTrackingEvent,
} from '../lib/infra/tracking';
import {
  app,
  fakeTrackingFacade,
  moduleTestInit,
  novelUtils,
} from './module-test-init';
import { NovelTestBuilder } from './utils/novel-test-builder';

describe('POST /api/novel/:id/events', () => {
  void moduleTestInit();

  let existingNovel: NovelDto;

  beforeEach(async () => {
    await app.logAs(TestUserBuilder.Alice());
    existingNovel = await novelUtils.createAndRetrieve(
      NovelTestBuilder.Default()
    );
  });

  describe('events tracked', () => {
    describe('chapters', () => {
      it('should track chapter addition', async () => {
        await app.logAs(TestUserBuilder.Alice());
        const expectedEvent = new NovelChapterAddedTrackingEvent(
          existingNovel.id,
          '123',
          TestUserBuilder.Alice().uid
        );

        await sendAndCheckBackEvent(
          new NovelChapterAddedEvent(
            { id: '123', name: 'chapter 1', at: 0, outline: 'outline' },
            TestUserBuilder.Alice().uid
          ),
          existingNovel.id,
          expectedEvent
        );
      });

      it('should track chapter deletion', async () => {
        await app.logAs(TestUserBuilder.Alice());

        const expectedEvent = new NovelChapterDeletedTrackingEvent(
          existingNovel.id,
          '123',
          TestUserBuilder.Alice().uid
        );

        await sendAndCheckBackEvent(
          new NovelChapterDeletedEvent(
            { id: '123' },
            TestUserBuilder.Alice().uid
          ),
          existingNovel.id,
          expectedEvent
        );
      });
    });

    describe('characters', () => {
      it('should track character addition', async () => {
        await app.logAs(TestUserBuilder.Alice());

        const expectedEvent = new NovelCharacterAddedTrackingEvent(
          existingNovel.id,
          '123',
          TestUserBuilder.Alice().uid
        );

        await sendAndCheckBackEvent(
          new NovelCharacterAddedEvent(
            {
              characterId: '123',
              name: 'character 1',
              at: 1,
              description: 'description',
            },
            TestUserBuilder.Alice().uid
          ),
          existingNovel.id,
          expectedEvent
        );
      });

      it('should track character deletion', async () => {
        await app.logAs(TestUserBuilder.Alice());

        const expectedEvent = new NovelCharacterDeletedTrackingEvent(
          existingNovel.id,
          '123',
          TestUserBuilder.Alice().uid
        );

        await sendAndCheckBackEvent(
          new NovelCharacterDeletedEvent(
            { characterId: '123' },
            TestUserBuilder.Alice().uid
          ),
          existingNovel.id,
          expectedEvent
        );
      });

      it('should track character color change', async () => {
        await app.logAs(TestUserBuilder.Alice());

        const expectedEvent = new NovelCharacterColorChangedTrackingEvent(
          existingNovel.id,
          '123',
          'red',
          TestUserBuilder.Alice().uid
        );

        await sendAndCheckBackEvent(
          new NovelCharacterColorUpdatedEvent(
            { characterId: '123', color: 'red' },
            TestUserBuilder.Alice().uid
          ),
          existingNovel.id,
          expectedEvent
        );
      });

      it('should track character tags change', async () => {
        await app.logAs(TestUserBuilder.Alice());

        const expectedEvent = new NovelCharacterTagsChangedTrackingEvent(
          existingNovel.id,
          '123',
          ['tag1', 'tag2'],
          TestUserBuilder.Alice().uid
        );

        await sendAndCheckBackEvent(
          new NovelCharacterTagsUpdatedEvent(
            { characterId: '123', tags: ['tag1', 'tag2'] },
            TestUserBuilder.Alice().uid
          ),
          existingNovel.id,
          expectedEvent
        );
      });
    });

    describe('scenes', () => {
      it('should track scene addition', async () => {
        await app.logAs(TestUserBuilder.Alice());

        const expectedEvent = new NovelSceneAddedTrackingEvent(
          existingNovel.id,
          'chapter-id',
          '123',
          TestUserBuilder.Alice().uid
        );

        await sendAndCheckBackEvent(
          new NovelSceneAddedEvent(
            {
              chapterId: 'chapter-id',
              sceneId: '123',
              title: 'scene 1',
              at: 0,
              outline: 'outline',
            },
            TestUserBuilder.Alice().uid
          ),
          existingNovel.id,
          expectedEvent
        );
      });

      it('should track scene deletion', async () => {
        await app.logAs(TestUserBuilder.Alice());

        const expectedEvent = new NovelSceneDeletedTrackingEvent(
          existingNovel.id,
          'chapter-id',
          '123',
          TestUserBuilder.Alice().uid
        );

        await sendAndCheckBackEvent(
          new NovelSceneDeletedEvent(
            { chapterId: 'chapter-id', sceneId: '123' },
            TestUserBuilder.Alice().uid
          ),
          existingNovel.id,
          expectedEvent
        );
      });

      it('should track scene content update', async () => {
        await app.logAs(TestUserBuilder.Alice());
        const diff = generateTextDiff('old', 'new content');

        const expectedEvent = new NovelSceneContentUpdatedTrackingEvent(
          existingNovel.id,
          'chapter-id',
          '123',
          diff.stats.diffWordCount,
          TestUserBuilder.Alice().uid
        );

        await sendAndCheckBackEvent(
          new NovelSceneContentUpdatedEvent(
            {
              chapterId: 'chapter-id',
              sceneId: '123',
              diff,
            },
            TestUserBuilder.Alice().uid
          ),
          existingNovel.id,
          expectedEvent
        );
      });
    });
  });
});

async function sendAndCheckBackEvent(
  event: NovelBaseDomainEvent,
  novelId: string,
  expectedEvent: TrackingEvent
): Promise<void> {
  await novelUtils.sendEvent(novelId, event);

  expect(fakeTrackingFacade.getByName(expectedEvent.eventName)).toHaveLength(1);
  const actualEvent = fakeTrackingFacade.getByName(expectedEvent.eventName)[0];

  expect(actualEvent).toEqual({
    ...expectedEvent,
    timestamp: expect.any(Date),
  });
}
