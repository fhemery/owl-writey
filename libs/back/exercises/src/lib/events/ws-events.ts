import { Server, Socket } from 'socket.io';

export class WsUser {
  constructor(public uid: string) {}
}

export class WsUserDetails {
  constructor(
    public readonly user: WsUser,
    private readonly socket: Socket,
    private readonly server: Server
  ) {}

  sendToUser(eventName: string, payload: unknown): void {
    this.socket.emit(eventName, payload);
  }

  sendToRoom(room: string, eventName: string, payload: unknown): void {
    this.server.to(room).emit(eventName, payload);
  }

  joinRoom(room: string): void {
    this.socket.join(room);
  }

  leaveRoom(room: string): void {
    this.socket.leave(room);
  }
}

export class WsEvent<T> {
  constructor(
    public name: string,
    public payload: T,
    public userDetails: WsUserDetails
  ) {}
}

export class UntypedWsEvent extends WsEvent<unknown> {}
