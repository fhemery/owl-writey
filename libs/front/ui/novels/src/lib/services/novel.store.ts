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
  Novel,
  NovelChapter,
  NovelCharacter,
  NovelDescriptionChangedEvent,
  NovelScene,
  NovelTitleChangedEvent,
} from '@owl/shared/novels/model';

import { NovelService } from './novel.service';

export interface NovelState {
  novel: Novel | null;
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
      getNovel(): Novel {
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
      async updateChapter(chapter: NovelChapter): Promise<boolean> {
        const novel = this.getNovel();
        novel.updateChapter(chapter);
        patchState(store, { novel: novel.copy() });
        return await novelService.update(novel);
      },
      async moveChapter(
        chapterIndex: number,
        toIndex: number
      ): Promise<boolean> {
        const novel = this.getNovel();
        novel.moveChapter(chapterIndex, toIndex);
        patchState(store, { novel: novel.copy() });
        return await novelService.update(novel);
      },
      async deleteChapter(chapter: NovelChapter): Promise<boolean> {
        const novel = this.getNovel();
        novel.deleteChapter(chapter.id);
        patchState(store, { novel: novel.copy() });
        return await novelService.update(novel);
      },
      async updateScene(
        chapterId: string,
        scene: NovelScene
      ): Promise<boolean> {
        const novel = this.getNovel();
        novel.updateScene(chapterId, scene);
        patchState(store, { novel: novel.copy() });
        return await novelService.update(novel);
      },
      async moveScene(
        chapterId: string,
        sceneIndex: number,
        toIndex: number
      ): Promise<boolean> {
        const novel = this.getNovel();
        novel.moveScene(chapterId, sceneIndex, toIndex);
        patchState(store, { novel: novel.copy() });
        return await novelService.update(novel);
      },
      async transferScene(
        initialChapterId: string,
        sceneId: string,
        targetChapterId: string,
        sceneIndex: number
      ): Promise<boolean> {
        const novel = this.getNovel();
        novel.transferScene(
          initialChapterId,
          sceneId,
          targetChapterId,
          sceneIndex
        );
        patchState(store, { novel: novel.copy() });
        return await novelService.update(novel);
      },
      async deleteScene(chapterId: string, sceneId: string): Promise<boolean> {
        const novel = this.getNovel();
        novel.deleteScene(chapterId, sceneId);
        patchState(store, { novel: novel.copy() });
        return await novelService.update(novel);
      },
      async addCharacterAt(index: number): Promise<void> {
        const novel = this.getNovel();
        novel.addCharacterAt(
          translateService.instant('novel.defaults.newCharacter.name'),
          '',
          index
        );
        patchState(store, { novel: novel.copy() });
        await novelService.update(novel);
      },
      async updateCharacter(character: NovelCharacter): Promise<boolean> {
        const novel = this.getNovel();
        novel.updateCharacter(character);
        patchState(store, { novel: novel.copy() });
        return await novelService.update(novel);
      },
      async moveCharacter(from: number, to: number): Promise<boolean> {
        const novel = this.getNovel();
        novel.moveCharacter(from, to);
        patchState(store, { novel: novel.copy() });
        return await novelService.update(novel);
      },
      async deleteCharacter(id: string): Promise<boolean> {
        const novel = this.getNovel();
        novel.deleteCharacter(id);
        patchState(store, { novel: novel.copy() });
        return await novelService.update(novel);
      },
      async updateTitle(title: string): Promise<boolean> {
        const novel = this.getNovel();
        const updateTitleEvent = new NovelTitleChangedEvent(title);

        patchState(store, { novel: updateTitleEvent.applyTo(novel) });
        return await novelService.sendEvent(novel.id, updateTitleEvent);
      },
      async updateDescription(description: string): Promise<boolean> {
        const novel = this.getNovel();
        const updateDescriptionEvent = new NovelDescriptionChangedEvent(
          description
        );

        patchState(store, { novel: updateDescriptionEvent.applyTo(novel) });
        return await novelService.sendEvent(novel.id, updateDescriptionEvent);
      },
    })
  ),
  withHooks({})
) {}
