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
  LocalConfigService,
  Resolution,
  RightPanelComponent,
  RightPanelService,
  ScreenResolutionService,
  SidePanelComponent,
} from '@owl/front/ui/common';

import { NovelStore } from '../../services/novel.store';
import { NovelHeaderComponent } from './components/novel-header/novel-header.component';
import { NovelSidebarComponent } from './components/novel-sidebar/novel-sidebar.component';

export const NOVEL_CONFIG_KEY = 'novel.config';
interface NovelConfig {
  isLeftPanelClosed?: boolean;
  isRightPanelClosed?: boolean;
}

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

  readonly localConfigService = inject(LocalConfigService);
  readonly config = this.localConfigService.get<NovelConfig>(NOVEL_CONFIG_KEY);

  isLeftPanelOpen = signal<boolean>(!this.config.isLeftPanelClosed);
  isRightPanelOpen = signal<boolean>(!this.config.isRightPanelClosed);

  shouldPanelBeFullWidth = computed(() =>
    this.#screenResolutionService.isSmallerOrEqualTo(Resolution.Tablet)
  );
  isOnePanelOpenedFullWidth = computed(
    () =>
      (this.isLeftPanelOpen() || this.isRightPanelOpen()) &&
      this.shouldPanelBeFullWidth()
  );

  constructor() {
    this.ensureConsistencyOfPanelsAndResolutions();
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

  private ensureConsistencyOfPanelsAndResolutions(): void {
    if (
      this.#screenResolutionService.isBiggerThan(Resolution.Tablet) &&
      !this.config.isLeftPanelClosed
    ) {
      this.isLeftPanelOpen.set(true);
    }
    if (
      this.#screenResolutionService.isBiggerThan(Resolution.Medium) &&
      !this.config.isRightPanelClosed
    ) {
      this.isRightPanelOpen.set(true);
    }
  }

  toggleLeftPanel(open?: boolean): void {
    if (
      open &&
      !this.#screenResolutionService.isBiggerThan(Resolution.Medium)
    ) {
      this.isRightPanelOpen.set(false);
    }

    this.localConfigService.patch(NOVEL_CONFIG_KEY, {
      isLeftPanelClosed: !open,
    });
  }

  toggleRightPanel(open?: boolean): void {
    if (
      open &&
      !this.#screenResolutionService.isBiggerThan(Resolution.Medium)
    ) {
      this.isLeftPanelOpen.set(false);
    }
    this.localConfigService.patch(NOVEL_CONFIG_KEY, {
      isRightPanelClosed: !open,
    });
  }

  ngOnInit(): void {
    // Load the novel when the component initializes
    void this.#novelStore.loadNovel(this.id());
  }
}
