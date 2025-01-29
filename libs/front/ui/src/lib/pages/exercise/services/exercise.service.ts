import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ExerciseDto } from '@owl/shared/contracts';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  readonly #httpClient = inject(HttpClient);

  async create(exerciseDto: ExerciseDto): Promise<string> {
    const response = await firstValueFrom(
      this.#httpClient.post<string>('/api/exercises', exerciseDto, {
        observe: 'response',
      })
    );
    const locationHeader = response.headers.get('location');
    if (!locationHeader) {
      throw new Error('Location header not found while creating exercise');
    }
    return locationHeader.split('/').pop() ?? '';
  }
}
