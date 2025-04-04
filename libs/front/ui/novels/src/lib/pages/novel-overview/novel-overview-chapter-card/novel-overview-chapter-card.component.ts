import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ContenteditableDirective } from '@owl/front/ui/common';

import {
  NovelChapterGeneralInfoViewModel,
  NovelChapterViewModel,
} from '../../../model';

@Component({
  selector: 'owl-novel-overview-chapter-card',
  imports: [CommonModule, ContenteditableDirective, MatIcon, TranslateModule],
  templateUrl: './novel-overview-chapter-card.component.html',
  styleUrl: './novel-overview-chapter-card.component.scss',
})
export class NovelOverviewChapterCardComponent {
  chapter = input.required<NovelChapterViewModel>();
  updateChapter = output<NovelChapterViewModel>();
  deleteChapter = output<void>();
  moveChapter = output<number>();
  goTo = output<void>();

  async updateTitle(title: string): Promise<void> {
    const newChapter = new NovelChapterViewModel(
      this.chapter().id,
      new NovelChapterGeneralInfoViewModel(
        title,
        this.chapter().generalInfo.outline
      ),
      this.chapter().scenes
    );
    if (title !== this.chapter().generalInfo.title) {
      this.updateChapter.emit(newChapter);
    }
  }

  async updateOutline(outline: string): Promise<void> {
    const newChapter = new NovelChapterViewModel(
      this.chapter().id,
      new NovelChapterGeneralInfoViewModel(
        this.chapter().generalInfo.title,
        outline
      ),
      this.chapter().scenes
    );
    if (outline !== this.chapter().generalInfo.outline) {
      this.updateChapter.emit(newChapter);
    }
  }

  onDeleteChapter(): void {
    this.deleteChapter.emit();
  }

  onMoveChapter(delta: number): void {
    this.moveChapter.emit(delta);
  }

  async goToChapter(): Promise<void> {
    this.goTo.emit();
  }
}
