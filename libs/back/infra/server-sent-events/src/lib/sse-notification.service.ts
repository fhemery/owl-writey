import { Injectable } from '@nestjs/common';
import { SseEvent } from '@owl/shared/common/contracts';
import { Subject } from 'rxjs';

class UserStream {
  constructor(
    readonly userId: string,
    readonly stream: Subject<{ data: SseEvent }>
  ) {}
}

@Injectable()
export class SseNotificationService {
  private rooms: Map<string, UserStream[]> = new Map<string, UserStream[]>();

  registerUser(userId: string): Subject<{ data: SseEvent }> {
    return this.registerToRoom('user-' + userId, userId);
  }

  notifyUser(userId: string, event: SseEvent): void {
    this.notifyRoom('user-' + userId, event);
  }

  registerToRoom(roomId: string, userId: string): Subject<{ data: SseEvent }> {
    const subject = new Subject<{ data: SseEvent }>();
    this.rooms.set(roomId, [
      ...(this.rooms.get(roomId) || []),
      new UserStream(userId, subject),
    ]);
    return subject;
  }

  notifyRoom(roomId: string, event: SseEvent, excludeUserId?: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.forEach((subject) => {
        if (excludeUserId !== subject.userId) {
          subject.stream.next({ data: event });
        }
      });
    }
  }

  /**
   * Use this method if the event to send depends on user
   **/
  notifyRoomDistinctly(
    roomId: string,
    eventProcessingFunction: (userId: string) => SseEvent | null
  ): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.forEach((subject) => {
        const ev = eventProcessingFunction(subject.userId);
        if (ev) {
          subject.stream.next({ data: ev });
        }
      });
    }
  }

  notifyUserInRoom(roomId: string, uid: string, event: SseEvent): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.forEach((subject) => {
        if (subject.userId === uid) {
          subject.stream.next({ data: event });
        }
      });
    }
  }

  getStreams(roomId: string): UserStream[] {
    return this.rooms.get(roomId) || [];
  }

  unregisterFromRoom(
    roomId: string,
    stream: Subject<{ data: SseEvent }>
  ): void {
    const room = this.rooms.get(roomId);
    if (room) {
      this.rooms.set(
        roomId,
        room.filter((s) => s.stream !== stream)
      );
    }
  }
}
