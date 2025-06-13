import {
  ApiResponse,
  NestTestApplication,
  SseEventList,
  SseUtils,
  waitFor,
} from '@owl/back/test-utils';
import {
  GetSettingsResponseDto,
  SetSettingsRequestDto,
} from '@owl/shared/common/contracts';
import {
  GetAllNovelsResponseDto,
  NovelDto,
  NovelEventDto,
  NovelToCreateDto,
} from '@owl/shared/novels/contracts';

export class NovelTestUtils {
  readonly #sseUtils = new SseUtils();
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

  async createAndRetrieve(novel: NovelToCreateDto): Promise<NovelDto> {
    const response = await this.create(novel);
    if (response.status !== 201) {
      throw new Error(`Failed to create novel : ${response.status}`);
    }

    const getResponse = await this.get(response.locationId);
    if (!getResponse.body) {
      throw new Error('Failed to retrieve novel');
    }
    return getResponse.body;
  }

  async update(
    novel: NovelDto,
    overrideId?: string
  ): Promise<ApiResponse<void>> {
    return await this.app.put<NovelDto>(
      `/api/novels/${overrideId || novel.id}`,
      novel
    );
  }

  async sendEvent(
    novelId: string,
    event: NovelEventDto
  ): Promise<ApiResponse<void>> {
    return await this.app.post<NovelEventDto, void>(
      `/api/novels/${novelId}/events`,
      event
    );
  }

  async getEvents(
    novelId: string,
    applicationPort: number
  ): Promise<SseEventList> {
    // Connect to the SSE endpoint
    const connection = await this.#sseUtils.connect(
      `http://localhost:${applicationPort}/api/novels/${novelId}/events`
    );

    // Wait for the connection to be established and events to be received
    // Use a more reliable approach with retries
    let retries = 0;
    const maxRetries = 5;

    while (retries < maxRetries) {
      await waitFor(100); // Longer wait time

      // Check if we've received any events
      if (connection._events && connection._events.length > 0) {
        break;
      }

      retries++;
    }

    return connection;
  }

  async deleteOne(id: string): Promise<ApiResponse<void>> {
    return await this.app.delete(`/api/novels/${id}`);
  }

  async reset(): Promise<void> {
    this.#sseUtils.disconnectAll();
    return Promise.resolve();
  }

  async addSettings(
    novelId: string,
    settingsName: string,
    settingsValue: string
  ): Promise<ApiResponse<void>> {
    return await this.app.patch<SetSettingsRequestDto>(`/api/settings`, {
      settings: [
        {
          scope: 'novel',
          scopeId: novelId,

          key: settingsName,
          value: settingsValue,
        },
      ],
    });
  }

  async getSettings(id: string): Promise<ApiResponse<GetSettingsResponseDto>> {
    return await this.app.get(`/api/settings?scope=novel&scopeId=${id}`);
  }
}
