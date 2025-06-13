import * as request from 'supertest';
import { App } from 'supertest/types';

import { ApiResponse } from './model/api-response';
import { ApiResponseStatus } from './model/api-response-status';
import { RegisteredTestUser } from './model/test-user';

export abstract class NestTestApplication {
  abstract reset(): Promise<void>;

  abstract close(): Promise<void>;

  async get<T>(url: string): Promise<ApiResponse<T>> {
    const req = request(this.getRequestTarget()).get(this.stripLocalhost(url));

    const response = await req;
    return new ApiResponse<T>(
      response.status as ApiResponseStatus,
      (response.body as T) || undefined,
      response.headers
    );
  }

  async post<TInput extends object, TOutput>(
    url: string,
    payload: TInput
  ): Promise<ApiResponse<TOutput>> {
    const req = request(this.getRequestTarget()).post(this.stripLocalhost(url));

    const response = await req.send(payload);
    return new ApiResponse<TOutput>(
      response.status as ApiResponseStatus,
      (response.body as TOutput) || undefined,
      response.headers
    );
  }

  async delete(url: string): Promise<ApiResponse<void>> {
    const req = request(this.getRequestTarget()).delete(
      this.stripLocalhost(url)
    );

    const response = await req;
    return new ApiResponse<void>(
      response.status as ApiResponseStatus,
      undefined,
      response.headers
    );
  }

  protected abstract getRequestTarget(): App | string;

  abstract logAs(user: RegisteredTestUser | null): Promise<void>;

  async put<TInput extends object>(
    url: string,
    payload: TInput
  ): Promise<ApiResponse<void>> {
    const req = request(this.getRequestTarget()).put(this.stripLocalhost(url));

    const response = await req.send(payload);
    return new ApiResponse<void>(
      response.status as ApiResponseStatus,
      undefined,
      response.headers
    );
  }

  async patch<TInput extends object>(
    url: string,
    payload: TInput
  ): Promise<ApiResponse<void>> {
    const req = request(this.getRequestTarget()).patch(
      this.stripLocalhost(url)
    );

    const response = await req.send(payload);
    return new ApiResponse<void>(
      response.status as ApiResponseStatus,
      undefined,
      response.headers
    );
  }

  private stripLocalhost(url: string): string {
    return url.replace(/http:\/\/localhost(:\d+)?/, '');
  }
}
