import { computed, inject, Injectable } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { AUTH_SERVICE } from '@owl/front/auth';
import { UserNotificationsService } from '@owl/front/infra';
import { NotificationService } from '@owl/front/ui/common';
import { NotificationEvent } from '@owl/shared/common/contracts';
import {
  ExerciseDto,
  ExercisedUpdateEvent,
} from '@owl/shared/exercises/contracts';
import { Subscription } from 'rxjs';

type ExerciseState = {
  exercise: ExerciseDto | null;
  currentUserId: string;
  loading: boolean;
  error?: string;
  connectionToExerciseUpdates?: Subscription;
};

const initialState: ExerciseState = {
  exercise: null,
  currentUserId: '',
  loading: true,
  error: undefined,
  connectionToExerciseUpdates: undefined,
};

@Injectable()
export class ExerciseStore extends signalStore(
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
        const subscription = userNotificationService
          .connect(exercise._links.connect || '')
          .subscribe((event) => {
            if (event.event === NotificationEvent.eventName) {
              const ev = event as NotificationEvent;
              notificationService.notifyEvent(
                ev.data.key +
                  (ev.data.uid === store.currentUserId() ? '.self' : '.other'),
                ev.data.data
              );
            }
            if (event.event === ExercisedUpdateEvent.eventName) {
              const ev = event as ExercisedUpdateEvent;
              patchState(store, (state) => ({
                ...state,
                exercise: ev.data.exercise,
              }));
            }
          });
        patchState(store, (state) => ({
          ...state,
          connectionToExerciseUpdates: subscription,
        }));
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
      const auth = inject(AUTH_SERVICE);

      patchState(store, (state) => ({
        ...state,
        currentUserId: auth.user()?.uid,
      }));
    },
    onDestroy: async (store) => {
      store.connectionToExerciseUpdates?.()?.unsubscribe();
    },
  })
) {}
