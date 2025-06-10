import { CommonModule } from '@angular/common';
import { Component, computed, input, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export type PanelPosition = 'left' | 'right';

@Component({
  selector: 'owl-side-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss'],
})
export class SidePanelComponent implements OnInit {
  position = input<PanelPosition>('left');

  readonly deviceType = signal<DeviceType>(getDeviceType());
  readonly isMobile = computed(() => this.deviceType() === DeviceType.Mobile);
  readonly panelState = signal<ToggleState>(ToggleState.Unknown);

  readonly isPanelOpen = computed(() => {
    switch (this.panelState()) {
      case ToggleState.Open:
        return true;
      case ToggleState.Closed:
        return false;
      case ToggleState.Unknown:
        return this.deviceType() !== DeviceType.Mobile;
    }
  });

  ngOnInit(): void {
    window.addEventListener('resize', () => {
      this.deviceType.set(getDeviceType());
    });
  }

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

function getDeviceType(): DeviceType {
  const width = window.innerWidth;
  return width < 480
    ? DeviceType.Mobile
    : width < 768
    ? DeviceType.Tablet
    : DeviceType.Desktop;
}

enum DeviceType {
  Mobile,
  Tablet,
  Desktop,
}
enum ToggleState {
  Unknown = 'Unknown',
  Open = 'Open',
  Closed = 'Closed',
}
