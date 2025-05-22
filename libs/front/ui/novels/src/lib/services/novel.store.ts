import { inject, Injectable } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { AUTH_SERVICE } from '@owl/front/auth';
import {
  Novel,
  NovelBaseDomainEvent,
  NovelChapter,
  NovelChapterAddedEvent,
  NovelChapterDeletedEvent,
  NovelChapterMovedEvent,
  NovelChapterOutlineUpdatedEvent,
  NovelChapterTitleUpdatedEvent,
  NovelCharacter,
  NovelCharacterAddedEvent,
  NovelDescriptionChangedEvent,
  NovelSceneAddedEvent,
  NovelSceneContentUpdatedEvent,
  NovelSceneDeletedEvent,
  NovelSceneMovedEvent,
  NovelSceneOutlineUpdatedEvent,
  NovelScenePovUpdatedEvent,
  NovelSceneTitleUpdatedEvent,
  NovelSceneTransferedEvent,
  NovelTitleChangedEvent,
} from '@owl/shared/novels/model';
import { v4 as uuidv4 } from 'uuid';

import { NovelService } from './novel.service';

export interface NovelState {
  novel: Novel | null;
  isLoading: boolean;
  error: string | null;
  userId: string;
}

const initialState: NovelState = {
  novel: null,
  isLoading: true,
  error: null,
  userId: '',
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
      async addChapterAt(index?: number): Promise<boolean> {
        return await this._applyEvent(
          new NovelChapterAddedEvent(
            {
              id: uuidv4(),
              name: translateService.instant('novel.defaults.newChapter.label'),
              outline: '',
              at: index,
            },
            store.userId()
          )
        );
      },
      async addSceneAt(chapterId: string, index?: number): Promise<boolean> {
        return await this._applyEvent(
          new NovelSceneAddedEvent(
            {
              chapterId,
              sceneId: uuidv4(),
              title: translateService.instant('novel.defaults.newScene.label'),
              outline: '',
              at: index,
            },
            store.userId()
          )
        );
      },
      async updateChapterTitle(
        chapterId: string,
        title: string
      ): Promise<boolean> {
        return await this._applyEvent(
          new NovelChapterTitleUpdatedEvent(
            {
              id: chapterId,
              title: title,
            },
            store.userId()
          )
        );
      },

      async updateChapterOutline(chapter: NovelChapter): Promise<boolean> {
        return await this._applyEvent(
          new NovelChapterOutlineUpdatedEvent(
            {
              id: chapter.id,
              outline: chapter.generalInfo.outline,
            },
            store.userId()
          )
        );
      },
      async moveChapter(
        chapterIndex: number,
        toIndex: number
      ): Promise<boolean> {
        // TODO : Request the chapterId here
        return await this._applyEvent(
          new NovelChapterMovedEvent(
            { id: this.getNovel().chapters[chapterIndex].id, atIndex: toIndex },
            store.userId()
          )
        );
      },
      async deleteChapter(chapter: NovelChapter): Promise<boolean> {
        return await this._applyEvent(
          new NovelChapterDeletedEvent({ id: chapter.id }, store.userId())
        );
      },
      async updateSceneOutline(
        chapterId: string,
        sceneId: string,
        outline: string
      ): Promise<boolean> {
        return await this._applyEvent(
          new NovelSceneOutlineUpdatedEvent(
            { chapterId, sceneId, outline },
            store.userId()
          )
        );
      },
      async updateSceneTitle(
        chapterId: string,
        sceneId: string,
        title: string
      ): Promise<boolean> {
        return await this._applyEvent(
          new NovelSceneTitleUpdatedEvent(
            { chapterId, sceneId, title },
            store.userId()
          )
        );
      },
      async updateScenePov(
        chapterId: string,
        sceneId: string,
        povId?: string
      ): Promise<boolean> {
        return await this._applyEvent(
          new NovelScenePovUpdatedEvent(
            { chapterId, sceneId, povId },
            store.userId()
          )
        );
      },
      async updateSceneContent(
        chapterId: string,
        sceneId: string,
        content: string
      ): Promise<boolean> {
        return await this._applyEvent(
          new NovelSceneContentUpdatedEvent(
            { chapterId, sceneId, content },
            store.userId()
          )
        );
      },
      async moveScene(
        chapterId: string,
        sceneId: string,
        toIndex: number
      ): Promise<boolean> {
        return await this._applyEvent(
          new NovelSceneMovedEvent(
            { chapterId, sceneId, at: toIndex },
            store.userId()
          )
        );
      },
      async transferScene(
        initialChapterId: string,
        sceneId: string,
        targetChapterId: string,
        sceneIndex: number
      ): Promise<boolean> {
        return await this._applyEvent(
          new NovelSceneTransferedEvent(
            {
              initialChapterId,
              sceneId,
              targetChapterId,
              at: sceneIndex,
            },
            store.userId()
          )
        );
      },
      async deleteScene(chapterId: string, sceneId: string): Promise<boolean> {
        return await this._applyEvent(
          new NovelSceneDeletedEvent(
            {
              chapterId,
              sceneId,
            },
            store.userId()
          )
        );
      },
      async addCharacterAt(index: number): Promise<boolean> {
        return await this._applyEvent(
          new NovelCharacterAddedEvent(
            {
              characterId: uuidv4(),
              name: translateService.instant(
                'novel.defaults.newCharacter.name'
              ),
              description: '',
              at: index,
            },
            store.userId()
          )
        );
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
        const updateTitleEvent = new NovelTitleChangedEvent(
          title,
          store.userId()
        );

        patchState(store, { novel: updateTitleEvent.applyTo(novel) });
        return await novelService.sendEvent(novel.id, updateTitleEvent);
      },
      async updateDescription(description: string): Promise<boolean> {
        const novel = this.getNovel();
        const updateDescriptionEvent = new NovelDescriptionChangedEvent(
          description,
          store.userId()
        );

        patchState(store, { novel: updateDescriptionEvent.applyTo(novel) });
        return await novelService.sendEvent(novel.id, updateDescriptionEvent);
      },

      async _applyEvent(event: NovelBaseDomainEvent): Promise<boolean> {
        const novel = this.getNovel();
        patchState(store, { novel: event.applyTo(novel) });
        return await novelService.sendEvent(novel.id, event);
      },
    })
  ),
  withHooks({
    onInit(store) {
      const auth = inject(AUTH_SERVICE);
      patchState(store, { userId: auth.user()?.uid });
    },
  })
) {}
