import { Injectable, signal } from '@angular/core';

import { RightPanelComponentDisplayRequest } from '../model/right-panel-component-display.request';

@Injectable({
  providedIn: 'root',
})
export class RightPanelService {
  currentComponent = signal<
    // I see no way of preventing this to be any...
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    RightPanelComponentDisplayRequest<any> | undefined
  >(undefined);

  displayComponent<TInput>(
    componentType: RightPanelComponentDisplayRequest<TInput>
  ): void {
    this.currentComponent.set(componentType);
  }

  clearComponent(): void {
    this.currentComponent.set(undefined);
  }
}
