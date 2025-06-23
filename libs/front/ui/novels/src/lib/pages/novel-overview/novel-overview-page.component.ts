
import { Component, inject, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  ConfirmDialogService,
  NotificationService,
  StatsChipComponent,
} from '@owl/front/ui/common';
import { NovelChapter } from '@owl/shared/novels/model';

import { NovelStore } from '../../services/novel.store';
import { NovelContextService } from '../../services/novel-context.service';
import { NovelCorkboardComponent } from '../novel-main/components/novel-corkboard/novel-corkboard.component';
import { NovelOverviewChapterCardComponent } from './novel-overview-chapter-card/novel-overview-chapter-card.component';
import { NovelOverviewNoChapterComponent } from './novel-overview-no-chapter/novel-overview-no-chapter.component';

@Component({
  selector: 'owl-novel-overview-page',
  imports: [
    NovelOverviewNoChapterComponent,
    NovelOverviewChapterCardComponent,
    TranslateModule,
    NovelCorkboardComponent,
    StatsChipComponent
],
  templateUrl: './novel-overview-page.component.html',
  styleUrl: './novel-overview-page.component.scss',
})
export class NovelOverviewPageComponent {
  @ViewChildren(NovelOverviewChapterCardComponent)
  chapterCards!: QueryList<NovelOverviewChapterCardComponent>;
  readonly #router = inject(Router);
  readonly #store = inject(NovelStore);
  readonly confirmDialogService = inject(ConfirmDialogService);
  readonly notificationService = inject(NotificationService);
  readonly novel = this.#store.novel;

  readonly #novelContext = inject(NovelContextService);

  constructor() {
    this.#novelContext.reset();
  }

  async addChapterAt(index?: number): Promise<void> {
    await this.#store.addChapterAt(index);
    setTimeout(() => this.focusChapterAt(index), 50);
  }

  private focusChapterAt(index?: number): void {
    if (index === undefined) {
      index = this.chapterCards.length - 1;
    }
    this.chapterCards.get(index)?.focus();
  }

  async updateChapter(
    currentChapter: NovelChapter,
    newChapter: NovelChapter
  ): Promise<void> {
    if (currentChapter.generalInfo.title !== newChapter.generalInfo.title) {
      await this.#store.updateChapterTitle(
        currentChapter.id,
        newChapter.generalInfo.title
      );
    }
    if (currentChapter.generalInfo.outline !== newChapter.generalInfo.outline) {
      await this.#store.updateChapterOutline(newChapter);
    }
  }

  convertToChapter(chapter: NovelChapter): NovelChapter {
    return chapter;
  }

  async deleteChapter(chapter: NovelChapter): Promise<void> {
    const confirmed = await this.confirmDialogService.openConfirmDialog(
      'novel.chapter.deleteConfirm.title',
      'novel.chapter.deleteConfirm.text'
    );
    if (confirmed) {
      const isSuccess = await this.#store.deleteChapter(chapter);
      if (!isSuccess) {
        this.notificationService.showError(
          'novel.chapter.deleteConfirm.result.error'
        );
      } else {
        this.notificationService.showInfo(
          'novel.chapter.deleteConfirm.result.ok'
        );
      }
    }
  }

  async moveChapter($event: { from: number; to: number }): Promise<void> {
    await this.#store.moveChapter($event.from, $event.to);
  }

  async goTo(chapter: NovelChapter): Promise<void> {
    await this.#router.navigate([
      'novels',
      this.novel()?.id || '',
      'chapters',
      chapter.id,
    ]);
  }
}
