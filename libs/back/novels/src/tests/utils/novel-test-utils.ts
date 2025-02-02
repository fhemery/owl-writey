import { ApiResponse, NestTestApplication } from '@owl/back/test-utils';
import { NovelDto, NovelToCreateDto } from '@owl/shared/contracts';

export class NovelTestUtils {
  constructor(private readonly app: NestTestApplication) {}

  create(novel: NovelToCreateDto): Promise<ApiResponse<void>> {
    return this.app.post<NovelToCreateDto, void>('/api/novels', novel);
  }
  async get(id: string | undefined): Promise<ApiResponse<NovelDto>> {
    return await this.app.get<NovelDto>(`/api/novels/${id}`);
  }
}
