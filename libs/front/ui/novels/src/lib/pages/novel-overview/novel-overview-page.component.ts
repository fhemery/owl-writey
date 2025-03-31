import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { NovelChaptersViewModel } from '../../model';
import { NovelStore } from '../../services/novel.store';
import { NovelOverviewChaptersComponent } from './novel-overview-chapters/novel-overview-chapters.component';
import { NovelOverviewNoChapterComponent } from './novel-overview-no-chapter/novel-overview-no-chapter.component';

@Component({
  selector: 'owl-novel-overview-page',
  imports: [
    CommonModule,
    NovelOverviewNoChapterComponent,
    NovelOverviewChaptersComponent,
  ],
  templateUrl: './novel-overview-page.component.html',
  styleUrl: './novel-overview-page.component.scss',
})
export class NovelOverviewPageComponent {
  readonly #store = inject(NovelStore);
  readonly novel = this.#store.novel;

  async addChapterAt(index?: number): Promise<void> {
    await this.#store.addChapterAt(index);
  }

  async editChapter(chapter: NovelChaptersViewModel): Promise<void> {
    await this.#store.updateChapter(chapter);
  }
}
