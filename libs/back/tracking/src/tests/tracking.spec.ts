import { TestUserBuilder } from '@owl/back/test-utils';
import { TrackingRequestDto } from '@owl/shared/common/contracts';

import { app, fakeTrackingFacade, moduleTestInit } from './module-test-init';
import { TrackingTestUtils } from './utils/tracking.utils';

describe('POST /api/events', () => {
  void moduleTestInit();

  let trackingUtils: TrackingTestUtils;

  beforeEach(() => {
    trackingUtils = new TrackingTestUtils(app);
  });

  describe('error cases', () => {
    it('should return 400 if events is empty', async () => {
      const response = await trackingUtils.trackEvents({ events: [] });
      expect(response.status).toBe(400);
    });

    it('should return 400 if events is not an array', async () => {
      const response = await trackingUtils.trackEvents({
        events: 'not an array',
      } as unknown as TrackingRequestDto);
      expect(response.status).toBe(400);
    });
  });

  describe('success cases', () => {
    it('should return 204', async () => {
      const response = await trackingUtils.trackEvent({
        eventName: 'test',
        data: {},
      });
      expect(response.status).toBe(204);
    });

    it('should add user data to events', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const response = await trackingUtils.trackEvent({
        eventName: 'test',
        data: {},
      });

      expect(response.status).toBe(204);
      expect(fakeTrackingFacade.events).toHaveLength(1);
      const event = fakeTrackingFacade.events[0];
      expect(event.eventName).toBe('test');
      expect(event.data).toEqual({});
      expect(event.userId).toBe(TestUserBuilder.Alice().uid);
    });

    it('should append the sessionId to any event if exists', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const response = await trackingUtils.trackEvents({
        events: [
          {
            eventName: 'test',
            data: {},
          },
        ],
        sessionId: 'test-session-id',
      });

      expect(response.status).toBe(204);
      expect(fakeTrackingFacade.events).toHaveLength(1);
      const event = fakeTrackingFacade.events[0];
      expect(event.sessionId).toBe('test-session-id');
    });
  });
});
