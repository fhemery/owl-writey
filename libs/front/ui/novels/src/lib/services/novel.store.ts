import { inject, Injectable } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';

import {
  NovelChapterViewModel,
  NovelGeneralInfoViewModel,
  NovelSceneViewModel,
  NovelViewModel,
} from '../model';
import { NovelService } from './novel.service';

export interface NovelState {
  novel: NovelViewModel | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: NovelState = {
  novel: null,
  isLoading: true,
  error: null,
};

@Injectable({
  providedIn: 'root',
})
export class NovelStore extends signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      novelService = inject(NovelService),
      translateService = inject(TranslateService)
    ) => ({
      getNovel(): NovelViewModel {
        const novel = store.novel();
        if (!novel) {
          throw new Error('Novel not found');
        }
        return novel;
      },
      async loadNovel(id: string): Promise<void> {
        try {
          const novel = await novelService.getNovel(id);
          patchState(store, { novel, isLoading: false, error: null });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to load novel';
          patchState(store, { isLoading: false, error: errorMessage });
        }
      },
      async deleteNovel(): Promise<boolean> {
        const novel = this.getNovel();
        return await novelService.delete(novel.id);
      },
      async addChapterAt(index?: number): Promise<void> {
        const novel = this.getNovel();
        novel.addChapterAt(
          translateService.instant('novel.defaults.newChapter.label'),
          '',
          index
        );
        await novelService.update(novel);
      },
      async addSceneAt(chapterId: string, index?: number): Promise<void> {
        const novel = this.getNovel();
        novel.addSceneAt(
          chapterId,
          translateService.instant('novel.defaults.newScene.label'),
          '',
          index
        );
        await novelService.update(novel);
      },
      async updateChapter(chapter: NovelChapterViewModel): Promise<boolean> {
        const novel = this.getNovel();
        novel.updateChapter(chapter);
        patchState(store, { novel: novel.copy() });
        return await novelService.update(novel);
      },
      async deleteChapter(chapter: NovelChapterViewModel): Promise<boolean> {
        const novel = this.getNovel();
        novel.deleteChapter(chapter);
        patchState(store, { novel: novel.copy() });
        return await novelService.update(novel);
      },
      async updateScene(
        chapterId: string,
        scene: NovelSceneViewModel
      ): Promise<boolean> {
        const novel = this.getNovel();
        novel.updateScene(chapterId, scene);
        patchState(store, { novel: novel.copy() });
        return await novelService.update(novel);
      },
      async updateGeneralInfo(
        generalInfo: NovelGeneralInfoViewModel
      ): Promise<boolean> {
        const novel = this.getNovel();
        const newNovel = new NovelViewModel(
          novel.id,
          generalInfo,
          novel.participants,
          novel.chapters
        );
        patchState(store, { novel: newNovel });
        return await novelService.update(newNovel);
      },
    })
  ),
  withHooks({})
) {}
