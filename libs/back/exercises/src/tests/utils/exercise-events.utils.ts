import { SseEventList } from '@owl/back/test-utils';
import { NotificationEvent } from '@owl/shared/contracts';

export function expectNotificationReceived(
  connection: SseEventList,
  key: string,
  data: Record<string, string>,
  uid?: string
): void {
  const event = connection.getLatest(NotificationEvent.eventName);
  expect(event).toBeDefined();

  const detailedEvent = event as NotificationEvent;
  expect(detailedEvent.data.key).toEqual(key);
  expect(detailedEvent.data.data).toEqual(data);
  expect(detailedEvent.data.uid).toEqual(uid);
}
