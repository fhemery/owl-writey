import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NovelDto, NovelToCreateDto } from '@owl/shared/novels/contracts';
import { firstValueFrom } from 'rxjs';

import { NovelViewModel } from '../model';
import { novelMappers } from './mappers/novel.mappers';

@Injectable({
  providedIn: 'root',
})
export class NovelService {
  readonly #httpClient = inject(HttpClient);

  async createNovel(novel: NovelToCreateDto): Promise<string> {
    const response = await firstValueFrom(
      this.#httpClient.post<string>('/api/novels', novel, {
        observe: 'response',
      })
    );
    return response.headers.get('Location')?.split('/').pop() || '';
  }

  async getNovel(id: string): Promise<NovelViewModel> {
    const response = await firstValueFrom(
      this.#httpClient.get<NovelDto>(`/api/novels/${id}`)
    );
    return novelMappers.novelDtoToViewModel(response);
  }

  async update(novel: NovelViewModel): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.#httpClient.put<NovelDto>(
          `/api/novels/${novel.id}`,
          novelMappers.novelViewModelToDto(novel),
          {
            observe: 'response',
          }
        )
      );
      return response.status === 204;
    } catch {
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.#httpClient.delete<void>(`/api/novels/${id}`, {
          observe: 'response',
        })
      );
      return response.status === 204;
    } catch {
      return false;
    }
  }
}
