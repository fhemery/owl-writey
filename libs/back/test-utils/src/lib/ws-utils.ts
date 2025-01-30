import { io, Socket } from 'socket.io-client';

export const wsUtils = {
  connect: (uid: string, port = 3456): Socket => {
    return io('http://localhost:3456', {
      transports: ['websocket', 'polling'],
      auth: { token: uid },
    });
  },

  waitFor: function <T>(sock: Socket, eventName: string): Promise<T> {
    return new Promise((resolve) => {
      sock.on(eventName, (data: T) => {
        resolve(data);
      });
    });
  },
};
