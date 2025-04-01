import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { NovelChaptersViewModel } from '../../model';
import { NovelStore } from '../../services/novel.store';
import { NovelCorkboardComponent } from '../novel-main/components/novel-corkboard/novel-corkboard.component';
import { NovelOverviewChapterCardComponent } from './novel-overview-chapter-card/novel-overview-chapter-card.component';
import { NovelOverviewNoChapterComponent } from './novel-overview-no-chapter/novel-overview-no-chapter.component';

@Component({
  selector: 'owl-novel-overview-page',
  imports: [
    CommonModule,
    NovelOverviewNoChapterComponent,
    NovelOverviewChapterCardComponent,
    TranslateModule,
    NovelCorkboardComponent,
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

  async updateChapter(chapter: NovelChaptersViewModel): Promise<void> {
    await this.#store.updateChapter(chapter);
  }

  convertToChapter(chapter: NovelChaptersViewModel): NovelChaptersViewModel {
    return chapter;
  }
}
