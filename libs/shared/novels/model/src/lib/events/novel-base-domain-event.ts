import { Novel } from '../novel';

export abstract class NovelBaseDomainEvent<T = unknown> {
  constructor(
    readonly eventName: string,
    readonly eventVersion: string,
    readonly data: T
  ) {}

  abstract applyTo(novel: Novel): Novel;

  toJsonString(): string {
    return JSON.stringify({
      eventName: this.eventName,
      eventVersion: this.eventVersion,
      data: this.data,
    });
  }
}
