import { io, Socket } from 'socket.io-client';

export class TestWsEvent {
  constructor(
    public readonly eventName: string,
    public readonly payload: unknown
  ) {}
}

export class TestWebSocket {
  readonly events: TestWsEvent[] = [];

  constructor(private readonly socket: Socket, private readonly uid: string) {
    socket.onAny((eventName, payload) => {
      console.log(
        `[TestWebSocket ${this.uid}] I did receive event`,
        eventName,
        JSON.stringify(payload)
      );
      this.events.push(new TestWsEvent(eventName, payload));
    });
  }

  async emit(eventName: string, payload: unknown): Promise<void> {
    console.log(
      `[TestWebSocket - ${this.uid}] Emitting`,
      eventName,
      'with payload',
      payload
    );
    this.socket.emit(eventName, payload);
    await waitFor(150);
  }

  getLatest<EventType>(eventName: string): EventType {
    const events = this.events.filter((e) => e.eventName === eventName);
    if (!events.length) {
      fail(`No event with name ${eventName} found`);
    }
    return events[events.length - 1].payload as EventType;
  }
}

export class WsUtils {
  private sockets: Socket[] = [];

  connectWs(uid: string, port = 3456): TestWebSocket {
    const socket = io(`http://localhost:${port}`, {
      transports: ['websocket', 'polling'],
      auth: { token: uid },
      multiplex: false,
      forceNew: true,
    });
    this.sockets.push(socket);
    return new TestWebSocket(socket, uid);
  }

  disconnectAll(): void {
    for (const socket of this.sockets) {
      socket.disconnect();
    }
  }
}

function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
