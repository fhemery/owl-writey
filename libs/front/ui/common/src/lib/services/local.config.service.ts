import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalConfigService {
  private config = new Map<string, WritableSignal<unknown>>();
  getUpdates<T>(key: string): Signal<T> {
    if (!this.config.has(key)) {
      this.config.set(
        key,
        signal<T>(JSON.parse(localStorage.getItem(key) || '{}'))
      );
    }
    return this.config.get(key) as Signal<T>;
  }

  update<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
    if (this.config.has(key)) {
      this.config.get(key)?.set(value);
    }
  }
}
