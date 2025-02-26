import { Injectable } from '@nestjs/common';
import { SseEvent } from '@owl/shared/contracts';
import { Observable, Subject } from 'rxjs';

class UserStream {
  constructor(
    readonly userId: string,
    readonly stream: Subject<{ data: SseEvent }>
  ) {}
}

@Injectable()
export class SseNotificationService {
  private rooms: Map<string, UserStream[]> = new Map<string, UserStream[]>();

  registerUser(userId: string): Observable<{ data: SseEvent }> {
    return this.registerToRoom('user-' + userId, userId);
  }

  notifyUser(userId: string, event: SseEvent): void {
    this.notifyRoom('user-' + userId, event);
  }

  registerToRoom(
    roomId: string,
    userId: string
  ): Observable<{ data: SseEvent }> {
    const subject = new Subject<{ data: SseEvent }>();
    this.rooms.set(roomId, [
      ...(this.rooms.get(roomId) || []),
      new UserStream(userId, subject),
    ]);
    return subject;
  }

  notifyRoom(roomId: string, event: SseEvent, excludeUserId?: string): void {
    console.log('notifying', roomId, JSON.stringify(event), excludeUserId);
    const room = this.rooms.get(roomId);
    if (room) {
      room.forEach((subject) => {
        if (excludeUserId !== subject.userId) {
          subject.stream.next({ data: event });
        }
      });
    }
  }
}
