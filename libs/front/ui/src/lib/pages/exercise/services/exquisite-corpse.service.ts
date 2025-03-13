import { inject, Injectable } from '@angular/core';
import { FirebaseAuthService } from '@owl/front/auth';
import { ConfigService } from '@owl/front/infra';
import {
  ExquisiteCorpseContentDto,
  exquisiteCorpseEvents,
} from '@owl/shared/contracts';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class ExquisiteCorpseService extends Socket {
  readonly #auth = inject(FirebaseAuthService);
  updates = this.fromEvent<ExquisiteCorpseContentDto, string>(
    exquisiteCorpseEvents.updates
  );

  constructor() {
    const env = inject(ConfigService).environment();

    super({
      url: env.baseUrl,
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

  takeTurn(exerciseId: string): void {
    this.emit(exquisiteCorpseEvents.takeTurn, { id: exerciseId });
  }

  submitTurn(exerciseId: string, content: string): void {
    this.emit(exquisiteCorpseEvents.submitTurn, { id: exerciseId, content });
  }

  cancelTurn(exerciseId: string): void {
    this.emit(exquisiteCorpseEvents.cancelTurn, { id: exerciseId });
  }
}
