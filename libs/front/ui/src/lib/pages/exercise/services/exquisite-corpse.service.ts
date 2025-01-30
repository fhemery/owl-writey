import { inject, Injectable } from '@angular/core';
import { FirebaseAuthService } from '@owl/front/auth';
import { EnvironmentService } from '@owl/front/infra';
import {
  ExquisiteCorpseContentDto,
  exquisiteCorpseEvents,
} from '@owl/shared/contracts';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class ExquisiteCorpseService extends Socket {
  readonly #auth = inject(FirebaseAuthService);
  updates = this.fromEvent<ExquisiteCorpseContentDto>(
    exquisiteCorpseEvents.updates
  );

  constructor() {
    const env = inject(EnvironmentService).env;

    super({
      url: env.baseBackendUrl,
      options: {
        autoConnect: false, // Prevent automatic connection
      },
    });
  }

  async doConnect(): Promise<void> {
    const token = await this.#auth.getToken();
    this.ioSocket.auth = { token };
    this.connect();
  }

  connectToExercise(exerciseId: string): void {
    this.emit(exquisiteCorpseEvents.connect, { id: exerciseId });
  }
}
