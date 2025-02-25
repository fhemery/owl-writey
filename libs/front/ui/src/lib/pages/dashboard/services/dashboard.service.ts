import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ExerciseSummaryDto,
  GetAllExercisesResponseDto,
} from '@owl/shared/contracts';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  readonly #httpClient = inject(HttpClient);

  async getExercises(params: {
    displayFinished: boolean;
  }): Promise<ExerciseSummaryDto[]> {
    const queryString = params.displayFinished ? '?includeFinished=true' : '';
    const response = await firstValueFrom(
      this.#httpClient.get<GetAllExercisesResponseDto>(
        `/api/exercises${queryString}`
      )
    );
    return response.exercises;
  }
}
