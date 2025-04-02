import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  ConfirmDialogService,
  NotificationService,
} from '@owl/front/ui/common';

import { NovelChapterViewModel } from '../../model';
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
  readonly #router = inject(Router);
  readonly #store = inject(NovelStore);
  readonly confirmDialogService = inject(ConfirmDialogService);
  readonly notificationService = inject(NotificationService);
  readonly novel = this.#store.novel;

  async addChapterAt(index?: number): Promise<void> {
    await this.#store.addChapterAt(index);
  }

  async updateChapter(chapter: NovelChapterViewModel): Promise<void> {
    await this.#store.updateChapter(chapter);
  }

  convertToChapter(chapter: NovelChapterViewModel): NovelChapterViewModel {
    return chapter;
  }

  async deleteChapter(chapter: NovelChapterViewModel): Promise<void> {
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

  async goTo(chapter: NovelChapterViewModel): Promise<void> {
    await this.#router.navigate([
      'novels',
      this.novel()?.id || '',
      'chapters',
      chapter.id,
    ]);
  }
}
