import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  Resolution,
  RightPanelComponent,
  RightPanelService,
  ScreenResolutionService,
  SidePanelComponent,
} from '@owl/front/ui/common';

import { NovelStore } from '../../services/novel.store';
import { NovelHeaderComponent } from './components/novel-header/novel-header.component';
import { NovelSidebarComponent } from './components/novel-sidebar/novel-sidebar.component';

@Component({
  selector: 'owl-novel-page',
  imports: [
    CommonModule,
    NovelSidebarComponent,
    NovelHeaderComponent,
    RightPanelComponent,
    RouterOutlet,
    TranslateModule,
    SidePanelComponent,
  ],
  templateUrl: './novel-main-page.component.html',
  styleUrls: ['./novel-main-page.component.scss'],
})
export class NovelMainPageComponent implements OnInit {
  readonly #novelStore = inject(NovelStore);
  readonly #rightPanelService = inject(RightPanelService);
  readonly #screenResolutionService = inject(ScreenResolutionService);

  isLeftPanelOpen = signal<boolean>(true);
  isRightPanelOpen = signal<boolean>(true);

  shouldPanelBeFullWidth = computed(() =>
    this.#screenResolutionService.isSmallerOrEqualTo(Resolution.Tablet)
  );
  isOnePanelOpenedFullWidth = computed(
    () =>
      (this.isLeftPanelOpen() || this.isRightPanelOpen()) &&
      this.shouldPanelBeFullWidth()
  );

  constructor() {
    this.isLeftPanelOpen.set(
      this.#screenResolutionService.isBiggerThan(Resolution.Tablet)
    );
    this.isRightPanelOpen.set(
      this.#screenResolutionService.isBiggerThan(Resolution.Medium)
    );
    effect(() => {
      this.toggleLeftPanel(this.isLeftPanelOpen());
    });
    effect(() => {
      this.toggleRightPanel(this.isRightPanelOpen());
    });
  }

  id = input.required<string>();

  readonly isLoading = this.#novelStore.isLoading;
  readonly novel = this.#novelStore.novel;
  readonly hasRightPanel = computed(
    () => !!this.#rightPanelService.currentComponent()
  );

  toggleLeftPanel(open?: boolean): void {
    if (
      open &&
      !this.#screenResolutionService.isBiggerThan(Resolution.Medium)
    ) {
      this.isRightPanelOpen.set(false);
    }
  }

  toggleRightPanel(open?: boolean): void {
    if (
      open &&
      !this.#screenResolutionService.isBiggerThan(Resolution.Medium)
    ) {
      this.isLeftPanelOpen.set(false);
    }
  }

  ngOnInit(): void {
    // Load the novel when the component initializes
    void this.#novelStore.loadNovel(this.id());
  }
}
