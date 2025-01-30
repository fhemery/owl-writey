import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  constructor(private socket: Socket) {}

  public sendEvent<T>(
    name: string,
    data?: unknown,
    callback?: (response: T) => void
  ): void {
    console.log(`sending event ${name} with data ${JSON.stringify(data)}`);

    this.socket.emit(name, data, callback);
  }

  public listenToEvent<T>(name: string): Observable<T> {
    console.log(`listening to event ${name}`);
    return this.socket.fromEvent<T>(name);
  }
}
