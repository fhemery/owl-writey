import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ExquisiteCorpseService {
  readonly #httpClient = inject(HttpClient);

  async takeTurn(exerciseId: string): Promise<void> {
    await firstValueFrom(
      this.#httpClient.post(`/api/exquisite-corpse/${exerciseId}/take-turn`, {})
    );
  }

  async submitTurn(exerciseId: string, content: string): Promise<void> {
    await firstValueFrom(
      this.#httpClient.post(`/api/exquisite-corpse/${exerciseId}/submit-turn`, {
        content,
      })
    );
  }

  async cancelTurn(exerciseId: string): Promise<void> {
    await firstValueFrom(
      this.#httpClient.post(
        `/api/exquisite-corpse/${exerciseId}/cancel-turn`,
        {}
      )
    );
  }
}
