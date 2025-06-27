export * from './lib/domain/ports/in/tracking.service';
export * from './lib/tracking.module';
export * from './lib/domain/model/tracking-event';

// TODO : Those imports are test driven, to avoid targetting posthog during integration tests, but can we fix this ?
export * from './lib/domain/ports/out/tracking.facade';
export * from './lib/infra/tracking-facades/fake-tracker/fake-tracking.facade';
