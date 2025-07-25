import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { ConfigurationDto } from '@owl/shared/common/contracts';
import { firstValueFrom } from 'rxjs';

import { ApplicationConfiguration } from './model/application.configuration';
import { ApplicationEnvironment } from './model/application-environment';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  #environment = signal<ApplicationConfiguration | null>(null);
  private initialized = false;

  private readonly httpClient = inject(HttpClient);

  async init(environment: ApplicationEnvironment): Promise<void> {
    if (this.initialized) {
      throw new Error(
        'Environment is already set. Please call ConfigService.init only once.'
      );
    }
    this.initialized = true;
    const config = await firstValueFrom(
      this.httpClient.get<ConfigurationDto>('/api/config')
    );

    this.#environment.set({ ...config, ...environment });
  }

  get environment(): Signal<ApplicationConfiguration> {
    if (!this.initialized) {
      throw new Error(
        'Environment is not set. Please call ConfigService.init from the root of the application.'
      );
    }
    return this.#environment as Signal<ApplicationConfiguration>;
  }
}
