import { inject, Injectable } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { NovelViewModel } from '../../../model';
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

@Injectable()
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
  })),
  withHooks({})
) {}
