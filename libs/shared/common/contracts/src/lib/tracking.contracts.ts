export interface TrackingRequestDto {
  events: TrackingEventDto[];
  sessionId?: string;
}

export interface TrackingEventDto {
  eventName: string;
  data: Record<string, unknown>;
}
