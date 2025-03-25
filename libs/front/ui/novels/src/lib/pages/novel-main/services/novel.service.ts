import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NovelDto } from '@owl/shared/contracts';
import { firstValueFrom } from 'rxjs';

import { NovelViewModel } from '../../../model';
import { novelMappers } from './mappers/novel.mappers';

@Injectable({
  providedIn: 'root',
})
export class NovelService {
  readonly #httpClient = inject(HttpClient);

  async getNovel(id: string): Promise<NovelViewModel> {
    const response = await firstValueFrom(
      this.#httpClient.get<NovelDto>(`/api/novels/${id}`)
    );
    return novelMappers.novelDtoToViewModel(response);
  }
}
