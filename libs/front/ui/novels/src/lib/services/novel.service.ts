import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toNovel, toNovelDto } from '@owl/shared/novel/utils';
import { NovelDto, NovelToCreateDto } from '@owl/shared/novels/contracts';
import { Novel, NovelBaseDomainEvent } from '@owl/shared/novels/model';
import { debounceTime, firstValueFrom, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NovelService {
  readonly #httpClient = inject(HttpClient);
  readonly novelToUpdate = new Subject<Novel>();

  constructor() {
    this.novelToUpdate.pipe(debounceTime(2000)).subscribe(async (novel) => {
      await this.doUpdateNovel(novel);
    });
  }

  async createNovel(novel: NovelToCreateDto): Promise<string> {
    const response = await firstValueFrom(
      this.#httpClient.post<string>('/api/novels', novel, {
        observe: 'response',
      })
    );
    return response.headers.get('Location')?.split('/').pop() || '';
  }

  async getNovel(id: string): Promise<Novel> {
    const response = await firstValueFrom(
      this.#httpClient.get<NovelDto>(`/api/novels/${id}`)
    );
    return toNovel(response);
  }

  async update(novel: Novel): Promise<boolean> {
    this.novelToUpdate.next(novel);
    return true;
  }

  async sendEvent(
    novelId: string,
    event: NovelBaseDomainEvent
  ): Promise<boolean> {
    await firstValueFrom(
      this.#httpClient.post<void>(`/api/novels/${novelId}/events`, {
        eventName: event.eventName,
        eventVersion: event.eventVersion,
        data: event.data,
      })
    );
    return true;
  }

  private async doUpdateNovel(novel: Novel): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.#httpClient.put<NovelDto>(
          `/api/novels/${novel.id}`,
          toNovelDto(novel),
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
