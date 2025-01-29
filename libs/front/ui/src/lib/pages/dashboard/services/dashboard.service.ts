import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ExerciseDto, GetAllExercisesResponseDto } from '@owl/shared/contracts';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  readonly #httpClient = inject(HttpClient);

  async getExercises(): Promise<ExerciseDto[]> {
    const response = await firstValueFrom(
      this.#httpClient.get<GetAllExercisesResponseDto>('/api/exercises')
    );
    return response.exercises;
  }
}
