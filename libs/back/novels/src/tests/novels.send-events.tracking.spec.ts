import { TestUserBuilder } from '@owl/back/test-utils';
import { NovelDto } from '@owl/shared/novels/contracts';
import { NovelChapterAddedEvent } from '@owl/shared/novels/model';

import { NovelChapterAddedTrackingEvent } from '../lib/infra/tracking/events/novel-chapter-added-tracking-event';
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
    it('should track chapter addition', async () => {
      await app.logAs(TestUserBuilder.Alice());
      await novelUtils.sendEvent(
        existingNovel.id,
        new NovelChapterAddedEvent(
          { id: '123', name: 'chapter 1', at: 0, outline: 'outline' },
          TestUserBuilder.Alice().uid
        )
      );

      const expectedEvent = new NovelChapterAddedTrackingEvent(
        existingNovel.id,
        'chapter 1',
        '123',
        TestUserBuilder.Alice().uid
      );

      expect(
        fakeTrackingFacade.getByName(expectedEvent.eventName)
      ).toHaveLength(1);

      const actualEvent = fakeTrackingFacade.getByName(
        expectedEvent.eventName
      )[0];
      expect(actualEvent).toEqual({
        ...expectedEvent,
        timestamp: expect.any(Date),
      });
    });
  });
});
