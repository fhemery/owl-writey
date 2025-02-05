import { computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { FirebaseAuthService } from '@owl/front/auth';
import { ExerciseDto, ExquisiteCorpseContentDto } from '@owl/shared/contracts';
import { interval } from 'rxjs';

import { ExquisiteCorpseService } from './exquisite-corpse.service';

type ExquisiteCorpseState = {
  exercise: ExerciseDto | null;
  content: ExquisiteCorpseContentDto | null;
  currentUserId: string;
  loading: boolean;
  error?: string;
};

const initialState: ExquisiteCorpseState = {
  exercise: null,
  content: null,
  currentUserId: '',
  loading: true,
  error: undefined,
};

export const ExquisiteCorpseStore = signalStore(
  withState(initialState),
  withMethods((store, service = inject(ExquisiteCorpseService)) => ({
    setExercise(exercise: ExerciseDto): void {
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
    takeTurn(): void {
      service.takeTurn(store.exercise()?.id || '');
    },
    submitTurn(content: string): void {
      service.submitTurn(store.exercise()?.id || '', content);
    },
    checkTurn(): void {
      console.log('Checking turn');
      const until = store.content()?.currentWriter?.until;
      if (until && new Date(until) < new Date()) {
        patchState(store, (state) => ({
          ...state,
          content: state.content
            ? {
                ...state.content,
                currentWriter: undefined,
              }
            : null,
        }));
      }
    },
  })),
  withComputed((store) => ({
    isCurrentUserTurn: computed(
      () => store.content()?.currentWriter?.author.id === store.currentUserId()
    ),
    canTakeTurn: computed(() => {
      if (!store.content()?.currentWriter) {
        return true;
      }

      const until = store.content()?.currentWriter?.until;
      if (until && new Date(until) < new Date()) {
        return true;
      }

      return false;
    }),
  })),
  withHooks({
    onInit: (store) => {
      const auth = inject(FirebaseAuthService);
      const service = inject(ExquisiteCorpseService);
      const route = inject(ActivatedRoute);

      // We are not using promise, because making onInit async would
      // cause takeUntilDestroy to not work (if onInit is async, it will
      // throw us out of injection context)
      service.doConnect().then(() => {
        service.updates.subscribe((content) => {
          store.updateContent(content);
        });
        service.connectToExercise(route.snapshot.params['id']);
      });

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
