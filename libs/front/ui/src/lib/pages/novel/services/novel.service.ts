import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NovelToCreateDto } from '@owl/shared/contracts';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NovelService {
  private httpClient = inject(HttpClient);

  async createNovel(novel: NovelToCreateDto): Promise<string> {
    const response = await firstValueFrom(
      this.httpClient.post<string>('/api/novels', novel, {
        observe: 'response',
      })
    );
    return response.headers.get('Location')?.split('/').pop() || '';
  }
}
