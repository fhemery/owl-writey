import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, model } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

import {
  Resolution,
  ScreenResolutionService,
} from '../../services/resolution.service';

export type PanelPosition = 'left' | 'right';

@Component({
  selector: 'owl-side-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltip, TranslateModule],
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss'],
})
export class SidePanelComponent {
  readonly #screenResolutionService = inject(ScreenResolutionService);

  position = input<PanelPosition>('left');
  width = input<string>('20vw');
  isFullWidth = computed(() => this.width() === '100vw');

  open = model<boolean>();

  readonly isMobile = computed(
    () => this.#screenResolutionService.resolution() === Resolution.Mobile
  );

  onToggle(): void {
    this.open.set(!this.open());
  }

  getToggleIcon(): string {
    if (this.position() === 'left') {
      return this.open() ? 'chevron_left' : 'chevron_right';
    } else {
      return this.open() ? 'chevron_right' : 'chevron_left';
    }
  }
}
