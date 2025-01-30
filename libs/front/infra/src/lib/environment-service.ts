import { Injectable } from '@angular/core';

import { ApplicationEnvironment } from './application-environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  #env?: ApplicationEnvironment;

  init(env: ApplicationEnvironment): void {
    this.#env = env;
  }

  get env(): ApplicationEnvironment {
    if (!this.#env) {
      throw new Error('Environment not initialized');
    }
    return this.#env;
  }
}
