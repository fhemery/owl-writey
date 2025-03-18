import { Module } from '@nestjs/common';

import { EventEmitterFacade } from './event-emitter.facade';

@Module({
  providers: [EventEmitterFacade],
  exports: [EventEmitterFacade],
})
export class EventsModule {}
