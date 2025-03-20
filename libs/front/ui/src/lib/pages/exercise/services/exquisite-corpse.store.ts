import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { FirebaseAuthService } from '@owl/front/auth';
import {
  ExquisiteCorpseContentDto,
  ExquisiteCorpseExerciseDto,
} from '@owl/shared/contracts';
import { interval } from 'rxjs';

import { ExerciseService } from './exercise.service';
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
  withMethods(
    (
      store,
      service = inject(ExquisiteCorpseService),
      exerciseService = inject(ExerciseService)
    ) => ({
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
        await service.takeTurn(store.exercise());
      },
      async submitTurn(content: string): Promise<void> {
        await service.submitTurn(content, store.exercise());
      },
      async cancelTurn(): Promise<void> {
        await service.cancelTurn(store.exercise());
      },
      async checkTurn(): Promise<void> {
        const exercise = store.exercise();
        if (!exercise) {
          return;
        }
        const until = exercise.content?.currentWriter?.until;
        if (until && new Date(until) < new Date()) {
          const updatedExercise = await exerciseService.getOne(exercise.id);
          patchState(store, () => ({
            exercise: updatedExercise as ExquisiteCorpseExerciseDto,
          }));
        }
      },
    })
  ),
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
