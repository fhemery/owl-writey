import { ApiResponse, NestTestApplication } from '@owl/back/test-utils';
import {
  ExerciseDto,
  ExerciseToCreateDto,
  GetAllExercisesResponseDto,
} from '@owl/shared/contracts';

import { app } from '../module-test-init';

export class ExerciseTestUtils {
  constructor(private readonly app: NestTestApplication) {}

  async list(params?: {
    includeFinished?: boolean;
  }): Promise<ApiResponse<GetAllExercisesResponseDto>> {
    const queryString = params?.includeFinished ? '?includeFinished=true' : '';
    return await this.app.get<GetAllExercisesResponseDto>(
      `/api/exercises${queryString}`
    );
  }

  async createAndGetId(exercise: ExerciseToCreateDto): Promise<string> {
    const response = await this.create(exercise);
    expect(response.status).toBe(201);
    if (!response.locationId) {
      fail('No location id found for created exercise');
    }

    return response.locationId;
  }

  async createAndFinish(exercise: ExerciseToCreateDto): Promise<string> {
    const id = await this.createAndGetId(exercise);
    await this.finish(id);

    return id;
  }

  async create(exercise: ExerciseToCreateDto): Promise<ApiResponse<void>> {
    return await this.app.post<ExerciseToCreateDto, void>(
      '/api/exercises',
      exercise
    );
  }

  async finish(exerciseId: string): Promise<ApiResponse<void>> {
    return await this.app.post(`/api/exercises/${exerciseId}/finish`, {});
  }

  async get(id: string): Promise<ExerciseDto> {
    const response = await this.app.get<ExerciseDto>(`/api/exercises/${id}`);
    expect(response.status).toBe(200);
    if (!response.body) {
      fail('No body found for exercise');
    }
    return response.body;
  }

  async getFromHateoas(
    exercise: ExerciseDto
  ): Promise<ApiResponse<ExerciseDto>> {
    if (!exercise._links.self) {
      fail('No invite link found');
    }
    return await app.get<ExerciseDto>(exercise._links.self);
  }

  async participateFromHateoas(
    exercise: ExerciseDto
  ): Promise<ApiResponse<void>> {
    if (!exercise._links.invite) {
      fail('No invite link found');
    }
    return await app.post(exercise._links.invite, {});
  }

  async getOne(exerciseId: string): Promise<ApiResponse<ExerciseDto>> {
    return await this.app.get<ExerciseDto>(`/api/exercises/${exerciseId}`);
  }

  async addParticipant(exerciseId: string): Promise<ApiResponse<void>> {
    return await this.app.post(`/api/exercises/${exerciseId}/participants`, {});
  }

  async removeParticipant(
    exerciseId: string,
    participantId: string
  ): Promise<ApiResponse<void>> {
    return await this.app.delete(
      `/api/exercises/${exerciseId}/participants/${participantId}`
    );
  }

  async delete(exerciseId: string): Promise<ApiResponse<void>> {
    return await this.app.delete(`/api/exercises/${exerciseId}`);
  }

  async createAndRetrieve(exercise: ExerciseToCreateDto): Promise<ExerciseDto> {
    const createResponse = await this.create(exercise);
    const getResponse = await app.get<ExerciseDto>(
      createResponse.headers?.location || ''
    );
    if (!getResponse.body) {
      fail('Exercise not found');
    }
    return getResponse.body;
  }

  async deleteFromHateoas(exercise: ExerciseDto): Promise<ApiResponse<void>> {
    if (!exercise._links.delete) {
      fail('No delete link found');
    }
    return await app.delete(exercise._links.delete);
  }

  async finishFromHateoas(exercise: ExerciseDto): Promise<ApiResponse<void>> {
    if (!exercise._links.finish) {
      fail('No finish link found');
    }
    return await app.post(exercise._links.finish, {});
  }

  async leaveFromHateoas(exercise: ExerciseDto): Promise<ApiResponse<void>> {
    if (!exercise._links.leave) {
      fail('No leave link found');
    }
    return await app.delete(exercise._links.leave);
  }

  async removeParticipantFromHateoas(
    exercise: ExerciseDto,
    uid: string
  ): Promise<ApiResponse<void>> {
    if (!exercise._links.removeParticipant) {
      fail('No removeParticipant link found');
    }
    return await app.delete(
      exercise._links.removeParticipant.replace('{id}', uid)
    );
  }
}
