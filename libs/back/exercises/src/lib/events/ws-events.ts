import { Socket } from 'socket.io';

export class WsEvent<T> {
  constructor(public name: string, public payload: T, public socket: Socket) {}
}

export class UntypedWsEvent extends WsEvent<unknown> {}
