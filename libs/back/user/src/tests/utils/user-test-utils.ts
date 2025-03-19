import {
  ApiResponse,
  NestTestApplication,
  RegisteredTestUser,
} from '@owl/back/test-utils';
import { Role, UserToCreateDto } from '@owl/shared/contracts';

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
    await this.app.logAs(user);
    const response = await this.app.get(`/api/users/${user.uid}`);
    if (response.status === 404) {
      const response = await this.createUser(user);
      if (response.status !== 201) {
        fail(
          `User creation failed with status ${response.status}. Maybe UsersModule is not part of the app?`
        );
      }
    }
  }

  async addRole(userId: string, role: Role): Promise<ApiResponse<void>> {
    return await this.app.post(`/api/users/${userId}/roles`, {
      role,
    });
  }
}
