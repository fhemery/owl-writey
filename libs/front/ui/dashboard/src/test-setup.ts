import '@analogjs/vitest-angular/setup-zone';

import { ReadableStream } from 'node:stream/web';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
(global as unknown as { ReadableStream: unknown }).ReadableStream =
  ReadableStream;

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
