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

  get<T>(key: string): T {
    return JSON.parse(localStorage.getItem(key) || '{}') as T;
  }

  update<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
    if (this.config.has(key)) {
      this.config.get(key)?.set(value);
    }
  }

  patch<T>(key: string, value: Partial<T>): void {
    const config = this.get<T>(key);
    this.update(key, { ...config, ...value });
  }
}
