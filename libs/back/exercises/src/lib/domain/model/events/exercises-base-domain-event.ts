import { EmittedEvent } from '@owl/back/infra/events';

import { Exercise } from '../exercise';

export abstract class ExerciseBaseDomainEvent<T = unknown>
  implements EmittedEvent<T & { exercise: Exercise; userId: string }>
{
  payload: T & { exercise: Exercise; userId: string };
  constructor(
    readonly name: string,
    userId: string,
    payload: T & { exercise: Exercise }
  ) {
    this.payload = { ...payload, userId };
  }
}
