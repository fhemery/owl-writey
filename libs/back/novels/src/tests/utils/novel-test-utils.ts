import { ApiResponse, NestTestApplication } from '@owl/back/test-utils';
import { NovelToCreateDto } from '@owl/shared/contracts';

export class NovelTestUtils {
  constructor(private readonly app: NestTestApplication) {}

  create(novel: NovelToCreateDto): Promise<ApiResponse<void>> {
    return this.app.post<NovelToCreateDto, void>('/api/novels', novel);
  }
}
