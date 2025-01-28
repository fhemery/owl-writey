import { ApiResponse, NestTestApplication } from '@owl/back/test-utils';
import { UserToCreateDto } from '@owl/shared/contracts';

export class UserTestUtils {
  constructor(private readonly app: NestTestApplication) {}

  async createUser(user: UserToCreateDto): Promise<ApiResponse<void>> {
    const response = await this.app.post<UserToCreateDto, void>(
      '/api/users',
      user
    );
    expect(response.status).toBe(201);
    return response;
  }
}
