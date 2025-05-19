import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LogDto, LogRequestDto } from '@owl/shared/common/contracts';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  readonly #httpClient = inject(HttpClient);
  readonly #isBatchEnabled: boolean;
  #logs: LogDto[] = [];

  constructor() {
    if (requestIdleCallback) {
      requestIdleCallback(() => this.sendLogs());
      this.#isBatchEnabled = true;
    } else {
      this.#isBatchEnabled = false;
    }
  }

  info(message: string): void {
    this.pushLog(message, 'info');
  }

  error(message: string, stack?: string): void {
    this.pushLog(message, 'error', stack);
  }

  warn(message: string): void {
    this.pushLog(message, 'warn');
  }

  debug(message: string): void {
    this.pushLog(message, 'debug');
  }

  pushLog(
    message: string,
    level: 'error' | 'warn' | 'debug' | 'info',
    stack?: string
  ): void {
    this.#logs.push({ message, level, stack });
    if (!this.#isBatchEnabled) {
      void this.sendLogs();
    }
  }

  private async sendLogs(): Promise<void> {
    if (requestIdleCallback) {
      requestIdleCallback(() => void this.sendLogs());
    }
    if (!this.#logs.length) {
      return;
    }
    const logs = this.#logs;
    this.#logs = [];
    const request: LogRequestDto = { logs: logs };
    try {
      await firstValueFrom(this.#httpClient.post<void>('/api/log', request));
    } catch (error) {
      console.error('Failed to send logs', error);
    }
  }
}
