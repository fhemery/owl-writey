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
import { UserNotificationsService } from '@owl/front/infra';
import { ExerciseDto, ExerciseUpdatedEvent } from '@owl/shared/contracts';

import { NotificationService } from '../../../services/notification.service';

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
  withMethods(
    (
      store,
      userNotificationService = inject(UserNotificationsService),
      notificationService = inject(NotificationService)
    ) => ({
      async setExercise(exercise: ExerciseDto): Promise<void> {
        if (exercise._links.connect) {
          await this.connectToExerciseUpdates(exercise);
        }
        patchState(store, (state) => ({
          ...state,
          exercise: exercise,
        }));
      },
      async connectToExerciseUpdates(exercise: ExerciseDto): Promise<void> {
        userNotificationService
          .connect(exercise._links.connect || '')
          .subscribe((event) => {
            if (event.event === ExerciseUpdatedEvent.eventName) {
              const ev = event as ExerciseUpdatedEvent;
              patchState(store, (state) => ({
                ...state,
                exercise: ev.data.exercise,
              }));
              if (ev.data.notification) {
                notificationService.notifyEvent(
                  ev.data.notification.key,
                  ev.data.notification.data
                );
              }
            }
          });
      },
    })
  ),
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
