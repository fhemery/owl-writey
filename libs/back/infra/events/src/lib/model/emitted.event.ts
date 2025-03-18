export interface EmittedEvent<T = unknown> {
  name: string;
  payload: T;
}
