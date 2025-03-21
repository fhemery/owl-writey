import { ApiResponse, NestTestApplication } from '@owl/back/test-utils';
import {
  GetAllNovelsResponseDto,
  NovelDto,
  NovelToCreateDto,
} from '@owl/shared/contracts';

export class NovelTestUtils {
  constructor(private readonly app: NestTestApplication) {}

  create(novel: NovelToCreateDto): Promise<ApiResponse<void>> {
    // return request(app.getHttp...).post('/api/novels').send(novel);
    return this.app.post<NovelToCreateDto, void>('/api/novels', novel);
  }
  async get(id: string | undefined): Promise<ApiResponse<NovelDto>> {
    return await this.app.get<NovelDto>(`/api/novels/${id}`);
  }

  async getAll(): Promise<ApiResponse<GetAllNovelsResponseDto>> {
    return await this.app.get(`/api/novels`);
  }

  async deleteAll(): Promise<ApiResponse<void>> {
    return await this.app.delete(`/api/novels`);
  }
}
