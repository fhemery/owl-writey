import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { NovelHeaderComponent } from './components/novel-header/novel-header.component';
import { NovelRightPaneComponent } from './components/novel-right-pane/novel-right-pane.component';
import { NovelSidebarComponent } from './components/novel-sidebar/novel-sidebar.component';
import { NovelStore } from './services/novel.store';

@Component({
  selector: 'owl-novel-page',
  imports: [
    CommonModule,
    NovelSidebarComponent,
    NovelHeaderComponent,
    NovelRightPaneComponent,
    RouterOutlet,
    TranslateModule,
  ],
  templateUrl: './novel-main-page.component.html',
  styleUrls: ['./novel-main-page.component.scss'],
  providers: [NovelStore],
})
export class NovelMainPageComponent implements OnInit {
  readonly #novelStore = inject(NovelStore);

  id = input.required<string>();

  // Expose the signals directly from the store
  readonly isLoading = this.#novelStore.isLoading;
  readonly novel = this.#novelStore.novel;

  ngOnInit(): void {
    // Load the novel when the component initializes
    void this.#novelStore.loadNovel(this.id());
  }
}
