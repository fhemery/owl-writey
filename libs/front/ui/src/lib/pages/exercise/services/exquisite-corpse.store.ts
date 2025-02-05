import { computed, inject } from '@angular/core';
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
    onInit: async (store) => {
      const auth = inject(FirebaseAuthService);
      const service = inject(ExquisiteCorpseService);
      const route = inject(ActivatedRoute);

      await service.doConnect();
      service.updates.subscribe((content) => {
        store.updateContent(content);
      });
      service.connectToExercise(route.snapshot.params['id']);

      patchState(store, (state) => ({
        ...state,
        currentUserId: auth.user()?.uid,
      }));
    },
  })
);
