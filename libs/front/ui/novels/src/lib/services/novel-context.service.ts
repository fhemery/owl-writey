import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NovelContextService {
  readonly chapterId = signal<string | undefined>(undefined);
  readonly sceneId = signal<string | undefined>(undefined);

  setChapter(id: string): void {
    this.reset();
    this.chapterId.set(id);
  }

  setScene(chapterId: string, sceneId: string): void {
    this.reset();
    this.chapterId.set(chapterId);
    this.sceneId.set(sceneId);
  }

  reset(): void {
    this.chapterId.set(undefined);
    this.sceneId.set(undefined);
  }
}
