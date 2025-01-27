import * as request from 'supertest';
import { App } from 'supertest/types';

import { ApiResponse } from './model/api-response';
import { ApiResponseStatus } from './model/api-response-status';
import { RequestOptions } from './model/request-options';

export abstract class NestTestApplication {
  abstract reset(): Promise<void>;

  abstract close(): Promise<void>;

  async get<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const req = request(this.getRequestTarget()).get(url);
    if (options?.token) {
      req.set('Authorization', `Bearer ${options.token}`);
    }
    const response = await req;
    return new ApiResponse<T>(
      response.status as ApiResponseStatus,
      (response.body as T) || undefined,
      response.headers
    );
  }

  async post<TInput extends object, TOutput>(
    url: string,
    payload: TInput,
    options?: RequestOptions
  ): Promise<ApiResponse<TOutput>> {
    const req = request(this.getRequestTarget()).post(url);
    if (options?.token) {
      req.set('Authorization', `Bearer ${options.token}`);
    }
    const response = await req.send(payload);
    return new ApiResponse<TOutput>(
      response.status as ApiResponseStatus,
      (response.body as TOutput) || undefined,
      response.headers
    );
  }

  async delete(
    url: string,
    options?: RequestOptions
  ): Promise<ApiResponse<void>> {
    const req = request(this.getRequestTarget()).delete(url);
    if (options?.token) {
      req.set('Authorization', `Bearer ${options.token}`);
    }
    const response = await req;
    return new ApiResponse<void>(
      response.status as ApiResponseStatus,
      undefined,
      response.headers
    );
  }

  protected abstract getRequestTarget(): App | string;

  async put<TInput extends object>(
    url: string,
    payload: TInput,
    options?: RequestOptions
  ): Promise<ApiResponse<void>> {
    const req = request(this.getRequestTarget()).put(url);
    if (options?.token) {
      req.set('Authorization', `Bearer ${options.token}`);
    }
    const response = await req.send(payload);
    return new ApiResponse<void>(
      response.status as ApiResponseStatus,
      undefined,
      response.headers
    );
  }
}
