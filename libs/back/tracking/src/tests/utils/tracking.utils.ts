import { ApiResponse, NestTestApplication } from '@owl/back/test-utils';
import {
  TrackingEventDto,
  TrackingRequestDto,
} from '@owl/shared/common/contracts';

export class TrackingTestUtils {
  constructor(private readonly app: NestTestApplication) {}

  async trackEvent(event: TrackingEventDto): Promise<ApiResponse<void>> {
    return this.app.post<TrackingRequestDto, void>('/api/events', {
      events: [event],
    });
  }

  async trackEvents(events: TrackingRequestDto): Promise<ApiResponse<void>> {
    return this.app.post<TrackingRequestDto, void>('/api/events', events);
  }
}
