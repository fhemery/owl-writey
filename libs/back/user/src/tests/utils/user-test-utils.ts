import {
  ApiResponse,
  NestTestApplication,
  RegisteredTestUser,
} from '@owl/back/test-utils';
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

  async getUser(uid: string): Promise<ApiResponse<RegisteredTestUser>> {
    const response = await this.app.get<RegisteredTestUser>(
      `/api/users/${uid}`
    );
    return response;
  }

  async createIfNotExists(user: RegisteredTestUser): Promise<void> {
    this.app.logAs(user);
    const response = await this.app.get(`/api/users/${user.uid}`);
    if (response.status === 404) {
      await this.createUser(user);
    }
  }
}
