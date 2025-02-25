import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ExerciseDto,
  exerciseErrors,
  ExerciseToCreateDto,
} from '@owl/shared/contracts';
import { firstValueFrom } from 'rxjs';

export enum RemoveParticipantResult {
  Success = 'Success',
  ErrorLastAdmin = 'ErrorLastAdmin',
  UnknownError = 'UnknownError',
}

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  readonly #httpClient = inject(HttpClient);

  async create(exerciseDto: ExerciseToCreateDto): Promise<string> {
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

  async getOne(id: string): Promise<ExerciseDto | null> {
    try {
      return await firstValueFrom(
        this.#httpClient.get<ExerciseDto>(`/api/exercises/${id}`)
      );
    } catch (error) {
      const httpError = error as { status?: number };
      if (httpError.status === 404) {
        return null;
      }
      console.error('Error while fetching exercise', error);
      throw error;
    }
  }

  async addParticipant(exerciseId: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.#httpClient.post(
          `/api/exercises/${exerciseId}/participants`,
          null,
          { observe: 'response' }
        )
      );
      return response.status === 204;
    } catch {
      return false;
    }
  }

  async removeParticipant(
    exerciseId: string,
    userId: string
  ): Promise<RemoveParticipantResult> {
    try {
      const response = await firstValueFrom(
        this.#httpClient.delete(
          `/api/exercises/${exerciseId}/participants/${userId}`,
          { observe: 'response' }
        )
      );
      if (response.status === 204) {
        return RemoveParticipantResult.Success;
      }
    } catch (e) {
      const httpError = e as { status?: number; message?: string };
      if (
        httpError.status === 400 &&
        httpError.message === exerciseErrors.removeLastAdmin
      ) {
        return RemoveParticipantResult.ErrorLastAdmin;
      }
    }
    return RemoveParticipantResult.UnknownError;
  }

  async delete(exerciseId: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.#httpClient.delete(`/api/exercises/${exerciseId}`, {
          observe: 'response',
        })
      );
      return response.status === 204;
    } catch {
      return false;
    }
  }
  async finish(exerciseId: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.#httpClient.post(`/api/exercises/${exerciseId}/finish`, null, {
          observe: 'response',
        })
      );
      return response.status === 204;
    } catch {
      return false;
    }
  }
}
