import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { FirebaseAuthService } from '@owl/front/auth';
import { ExerciseDto } from '@owl/shared/contracts';

type ExerciseState = {
  exercise: ExerciseDto | null;
  currentUserId: string;
  loading: boolean;
  error?: string;
};

const initialState: ExerciseState = {
  exercise: null,
  currentUserId: '',
  loading: true,
  error: undefined,
};

export const ExerciseStore = signalStore(
  withState(initialState),
  withMethods((store) => ({
    async setExercise(exercise: ExerciseDto): Promise<void> {
      patchState(store, (state) => ({
        ...state,
        exercise: exercise,
      }));
    },
  })),
  withComputed((store) => ({
    isAdmin: computed<boolean>(
      () =>
        !!store
          .exercise()
          ?.participants.find((p) => p.uid === store.currentUserId())?.isAdmin
    ),
  })),
  withHooks({
    onInit: async (store) => {
      const auth = inject(FirebaseAuthService);

      patchState(store, (state) => ({
        ...state,
        currentUserId: auth.user()?.uid,
      }));
    },
  })
);
