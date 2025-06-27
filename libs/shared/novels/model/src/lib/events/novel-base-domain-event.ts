import { v4 as uuidv4 } from 'uuid';

import { Novel } from '../novel';

export abstract class NovelBaseDomainEvent<T = unknown> {
  constructor(
    readonly eventId: string = uuidv4(),
    readonly eventName: string,
    readonly eventVersion: string,
    readonly userId: string,
    readonly data: T,
    readonly eventSequentialId?: number
  ) {}

  abstract applyTo(novel: Novel): Novel;
}
