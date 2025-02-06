import { Server, Socket } from 'socket.io';

import { WsUser } from './ws-user';

export class WsSession {
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
