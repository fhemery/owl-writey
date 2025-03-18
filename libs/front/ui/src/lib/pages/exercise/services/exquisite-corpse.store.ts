import { computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { FirebaseAuthService } from '@owl/front/auth';
import {
  ExerciseStatus,
  ExquisiteCorpseContentDto,
  ExquisiteCorpseExerciseDto,
} from '@owl/shared/contracts';
import { interval } from 'rxjs';

import { ExquisiteCorpseService } from './exquisite-corpse.service';

type ExquisiteCorpseState = {
  exercise: ExquisiteCorpseExerciseDto | null;
  currentUserId: string;
  loading: boolean;
  error?: string;
};

const initialState: ExquisiteCorpseState = {
  exercise: null,
  currentUserId: '',
  loading: true,
  error: undefined,
};

export const ExquisiteCorpseStore = signalStore(
  withState(initialState),
  withMethods((store, service = inject(ExquisiteCorpseService)) => ({
    setExercise(exercise: ExquisiteCorpseExerciseDto): void {
      patchState(store, (state) => ({
        ...state,
        exercise: exercise,
      }));
    },
    updateContent(content: ExquisiteCorpseContentDto): void {
      patchState(store, (state) => ({
        ...state,
        content: content,
        loading: false,
      }));
    },
    async takeTurn(): Promise<void> {
      await service.takeTurn(store.exercise()?.id || '');
    },
    async submitTurn(content: string): Promise<void> {
      await service.submitTurn(store.exercise()?.id || '', content);
    },
    async cancelTurn(): Promise<void> {
      await service.cancelTurn(store.exercise()?.id || '');
    },
    checkTurn(): void {
      const exercise = store.exercise();
      if (!exercise) {
        return;
      }
      const content = store.exercise()?.content;
      const until = content?.currentWriter?.until;
      if (until && new Date(until) < new Date()) {
        patchState(store, () => ({
          exercise: {
            ...exercise,
            content: { ...exercise.content, currentWriter: undefined },
          },
        }));
      }
    },
  })),
  withComputed((store) => ({
    isCurrentUserTurn: computed(
      () =>
        store.exercise()?.content.currentWriter?.author.uid ===
        store.currentUserId()
    ),
    isFinished: computed(
      () =>
        store.exercise()?.status === ExerciseStatus.Finished ||
        (store.exercise()?.content?.scenes?.length || 0) >
          (store.exercise()?.config as { nbIterations: number }).nbIterations
    ),
    canTakeTurn: computed(() => {
      if (!store.exercise()?.content?.currentWriter) {
        return true;
      }

      const until = store.exercise()?.content?.currentWriter?.until;
      return !!(until && new Date(until) < new Date());
    }),
  })),
  withHooks({
    onInit: (store) => {
      const auth = inject(FirebaseAuthService);

      patchState(store, (state) => ({
        ...state,
        currentUserId: auth.user()?.uid,
      }));

      interval(2000)
        // 👇 Automatically unsubscribe when the store is destroyed.
        .pipe(takeUntilDestroyed())
        .subscribe(() => store.checkTurn());
    },
  })
);
