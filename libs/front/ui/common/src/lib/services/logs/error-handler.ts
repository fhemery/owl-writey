import { ErrorHandler, inject, Injectable } from '@angular/core';

import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})
export class FrontErrorHandler implements ErrorHandler {
  readonly #loggingService = inject(LoggingService);

  handleError(error: { message: string; stack?: string }): void {
    this.#loggingService.error(error.message, error.stack);
    throw error;
  }
}
