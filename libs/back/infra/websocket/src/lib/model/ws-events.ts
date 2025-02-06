import { WsSession } from './ws-session';

export class WsEvent<T> {
  constructor(
    public name: string,
    public payload: T,
    public userDetails: WsSession
  ) {}
}

export class UntypedWsEvent extends WsEvent<unknown> {}
