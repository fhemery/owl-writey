import { NestTestApplication } from '@owl/back/test-utils';
import { ExerciseDto, ExerciseToCreateDto } from '@owl/shared/contracts';

export class ExerciseTestUtils {
  constructor(private readonly app: NestTestApplication) {}

  async createExercise(exercise: ExerciseToCreateDto): Promise<string> {
    const response = await this.app.post<ExerciseToCreateDto, void>(
      '/api/exercises',
      exercise
    );
    expect(response.status).toBe(201);
    if (!response.locationId) {
      fail('No location id found for created exercise');
    }

    return response.locationId;
  }

  async get(id: string): Promise<ExerciseDto> {
    const response = await this.app.get<ExerciseDto>(`/api/exercises/${id}`);
    expect(response.status).toBe(200);
    if (!response.body) {
      fail('No body found for exercise');
    }
    return response.body;
  }
}
