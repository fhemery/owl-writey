import { Injectable } from '@angular/core';
import { ExquisiteCorpseContentDto } from '@owl/shared/contracts';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class ExquisiteCorpseService extends Socket {
  updates = this.fromEvent<ExquisiteCorpseContentDto>('exCorpse:updates');

  constructor() {
    // TODO : use a variable url
    super({ url: 'http://localhost:3000', options: {} }); // TODO secure the connection with the auth parameter in the options
  }

  connectToExercise(exerciseId: string): void {
    this.emit('exCorpse:connect', { id: exerciseId });
  }
}
