import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { NovelStore } from '../../services/novel.store';
import { NovelHeaderComponent } from './components/novel-header/novel-header.component';
import { NovelRightPaneComponent } from './components/novel-right-pane/novel-right-pane.component';
import { NovelSidebarComponent } from './components/novel-sidebar/novel-sidebar.component';

@Component({
  selector: 'owl-novel-page',
  imports: [
    CommonModule,
    NovelSidebarComponent,
    NovelHeaderComponent,
    NovelRightPaneComponent,
    RouterOutlet,
    TranslateModule,
    MatIcon,
  ],
  templateUrl: './novel-main-page.component.html',
  styleUrls: ['./novel-main-page.component.scss'],
})
export class NovelMainPageComponent implements OnInit {
  readonly #novelStore = inject(NovelStore);

  id = input.required<string>();

  // Expose the signals directly from the store
  readonly isLoading = this.#novelStore.isLoading;
  readonly novel = this.#novelStore.novel;

  readonly deviceType = signal<DeviceType>(getDeviceType());
  readonly isMobile = computed(() => this.deviceType() === DeviceType.Mobile);
  readonly leftPaneState = signal<ToggleState>(ToggleState.Unknown);

  readonly isLeftPaneOpen = computed(() => {
    switch (this.leftPaneState()) {
      case ToggleState.Open:
        return true;
      case ToggleState.Closed:
        return false;
      case ToggleState.Unknown:
        return this.deviceType() !== DeviceType.Mobile;
    }
  });

  ngOnInit(): void {
    // Load the novel when the component initializes
    void this.#novelStore.loadNovel(this.id());
    window.addEventListener('resize', () => {
      this.deviceType.set(getDeviceType());
    });
  }

  toggleLeftPane(): void {
    this.leftPaneState.set(
      this.isLeftPaneOpen() ? ToggleState.Closed : ToggleState.Open
    );
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
