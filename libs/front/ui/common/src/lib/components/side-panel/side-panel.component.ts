import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import {
  Resolution,
  ScreenResolutionService,
} from '../../services/device-type.service';

export type PanelPosition = 'left' | 'right';

@Component({
  selector: 'owl-side-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss'],
})
export class SidePanelComponent {
  readonly #screenResolutionService = inject(ScreenResolutionService);

  position = input<PanelPosition>('left');
  width = input<string>('20vw');

  open = model<boolean>();

  readonly isMobile = computed(
    () => this.#screenResolutionService.deviceType() === Resolution.Mobile
  );
  readonly panelState = signal<ToggleState>(ToggleState.Unknown);

  readonly isPanelOpen = computed(() => {
    switch (this.panelState()) {
      case ToggleState.Open:
        return true;
      case ToggleState.Closed:
        return false;
      case ToggleState.Unknown:
        return !this.isMobile();
    }
  });

  onToggle(): void {
    this.panelState.set(
      this.isPanelOpen() ? ToggleState.Closed : ToggleState.Open
    );
  }

  getToggleIcon(): string {
    if (this.position() === 'left') {
      return this.isPanelOpen() ? 'chevron_left' : 'chevron_right';
    } else {
      return this.isPanelOpen() ? 'chevron_right' : 'chevron_left';
    }
  }
}

enum ToggleState {
  Unknown = 'Unknown',
  Open = 'Open',
  Closed = 'Closed',
}
