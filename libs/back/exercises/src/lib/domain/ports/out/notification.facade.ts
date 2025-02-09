export const NotificationFacade = Symbol('NotificationFacade');
export interface NotificationFacade {
  notifyUser<Payload>(
    userId: string,
    event: string,
    payload: Payload
  ): Promise<void>;
  notifyRoom<Payload>(
    roomId: string,
    event: string,
    payload: Payload,
    excludeUserId?: string
  ): Promise<void>;
}
