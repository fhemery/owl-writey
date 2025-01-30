import { inject, Injectable } from '@angular/core';
import { EnvironmentService } from '@owl/front/infra';
import {
  ExquisiteCorpseContentDto,
  exquisiteCorpseEvents,
} from '@owl/shared/contracts';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class ExquisiteCorpseService extends Socket {
  updates = this.fromEvent<ExquisiteCorpseContentDto>(
    exquisiteCorpseEvents.updates
  );

  constructor() {
    const env = inject(EnvironmentService).env;
    super({ url: env.baseBackendUrl, options: {} }); // TODO secure the connection with the auth parameter in the options
  }

  connectToExercise(exerciseId: string): void {
    this.emit(exquisiteCorpseEvents.connect, { id: exerciseId });
  }
}
