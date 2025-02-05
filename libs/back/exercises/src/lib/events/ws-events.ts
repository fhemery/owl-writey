import { Server, Socket } from 'socket.io';

export class WsUser {
  constructor(public uid: string) {}
}

export class WsUserDetails {
  constructor(
    public user: WsUser,
    public socket: Socket,
    public server: Server // TODO we need an encapsulation to avoid server usage abuses
  ) {}
}

export class WsEvent<T> {
  constructor(
    public name: string,
    public payload: T,
    public userDetails: WsUserDetails
  ) {}
}

export class UntypedWsEvent extends WsEvent<unknown> {}
