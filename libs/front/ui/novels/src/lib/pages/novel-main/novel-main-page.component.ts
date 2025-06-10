import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  RightPanelComponent,
  RightPanelService,
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

  id = input.required<string>();

  readonly isLoading = this.#novelStore.isLoading;
  readonly novel = this.#novelStore.novel;
  readonly hasRightPanel = computed(
    () => !!this.#rightPanelService.currentComponent()
  );

  ngOnInit(): void {
    // Load the novel when the component initializes
    void this.#novelStore.loadNovel(this.id());
  }
}
