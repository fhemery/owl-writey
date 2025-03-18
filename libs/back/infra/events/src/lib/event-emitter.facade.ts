import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { EmittedEvent } from './model/emitted.event';

@Injectable()
export class EventEmitterFacade {
  constructor(private eventEmitter: EventEmitter2) {}

  emit<T>(event: EmittedEvent<T>): void {
    this.eventEmitter.emit(event.name, event);
  }
}
