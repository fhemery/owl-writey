import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import { ConfigurationDto } from '@owl/shared/contracts';
import { firstValueFrom } from 'rxjs';

import { ApplicationConfiguration } from './model/application.configuration';
import { ApplicationEnvironment } from './model/application-environment';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  #environment = signal<ApplicationConfiguration | null>(null);
  private initialized = false;

  constructor(private httpClient: HttpClient) {}

  async init(environment: ApplicationEnvironment): Promise<void> {
    if (this.initialized) {
      throw new Error(
        'Environment is already set. Please call StoriesConfigurationService.init only once.'
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
        'Environment is not set. Please call StoriesConfigurationService.init from the root of the application.'
      );
    }
    return this.#environment as Signal<ApplicationConfiguration>;
  }
}
