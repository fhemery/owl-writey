import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ExquisiteCorpseExerciseDto } from '@owl/shared/contracts';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ExquisiteCorpseService {
  readonly #httpClient = inject(HttpClient);

  async takeTurn(exercise: ExquisiteCorpseExerciseDto | null): Promise<void> {
    if (!exercise?._links.takeTurn) {
      return;
    }
    await firstValueFrom(this.#httpClient.post(exercise._links.takeTurn, {}));
  }

  async submitTurn(
    content: string,
    exercise: ExquisiteCorpseExerciseDto | null
  ): Promise<void> {
    if (!exercise?._links.submitTurn) {
      return;
    }
    await firstValueFrom(
      this.#httpClient.post(exercise._links.submitTurn, {
        content,
      })
    );
  }

  async cancelTurn(exercise: ExquisiteCorpseExerciseDto | null): Promise<void> {
    if (!exercise?._links.cancelTurn) {
      return;
    }
    await firstValueFrom(this.#httpClient.post(exercise._links.cancelTurn, {}));
  }
}
