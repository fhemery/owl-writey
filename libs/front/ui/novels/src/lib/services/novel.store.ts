import { inject, Injectable } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { NovelGeneralInfoViewModel, NovelViewModel } from '../model';
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
  withMethods((store, novelService = inject(NovelService)) => ({
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
      const novel = store.novel();
      if (!novel) {
        return false;
      }
      return await novelService.delete(novel.id);
    },
    async updateGeneralInfo(
      generalInfo: NovelGeneralInfoViewModel
    ): Promise<boolean> {
      const novel = store.novel();
      if (!novel) {
        return false;
      }
      const newNovel = { ...novel, generalInfo };
      patchState(store, { novel: newNovel });
      return await novelService.update(newNovel);
    },
  })),
  withHooks({})
) {}
