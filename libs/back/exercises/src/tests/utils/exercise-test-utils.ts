import { ApiResponse, NestTestApplication } from '@owl/back/test-utils';
import {
  ExerciseDto,
  ExerciseToCreateDto,
  GetAllExercisesResponseDto,
} from '@owl/shared/contracts';

export class ExerciseTestUtils {
  constructor(private readonly app: NestTestApplication) {}

  async list(): Promise<ApiResponse<GetAllExercisesResponseDto>> {
    return await this.app.get<GetAllExercisesResponseDto>('/api/exercises');
  }

  async createAndGetId(exercise: ExerciseToCreateDto): Promise<string> {
    const response = await this.create(exercise);
    expect(response.status).toBe(201);
    if (!response.locationId) {
      fail('No location id found for created exercise');
    }

    return response.locationId;
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
}
