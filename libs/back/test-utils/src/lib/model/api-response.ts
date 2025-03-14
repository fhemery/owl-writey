import { ApiResponseStatus } from './api-response-status';

export interface ApiResponseHeaders {
  location?: string;
}

export class ApiResponse<T> {
  constructor(
    readonly status: ApiResponseStatus,
    readonly body?: T | undefined,
    readonly headers?: ApiResponseHeaders
  ) {}

  get locationId(): string | undefined {
    return this.headers?.location?.split('/').pop();
  }

  expectStatus(expectedStatus: ApiResponseStatus): ApiResponse<T> {
    expect(this.status).toBe(expectedStatus);
    return this;
  }

  expectBody(body: T): ApiResponse<T> {
    expect(this.body).toEqual(body);
    return this;
  }
}
