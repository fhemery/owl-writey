import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ContenteditableDirective } from '@owl/front/ui/common';

import { NovelChapterViewModel } from '../../../model';

@Component({
  selector: 'owl-novel-overview-chapter-card',
  imports: [CommonModule, ContenteditableDirective],
  templateUrl: './novel-overview-chapter-card.component.html',
  styleUrl: './novel-overview-chapter-card.component.scss',
})
export class NovelOverviewChapterCardComponent {
  chapter = input.required<NovelChapterViewModel>();
  updateChapter = output<NovelChapterViewModel>();

  async updateTitle(title: string): Promise<void> {
    const newChapter = new NovelChapterViewModel(
      this.chapter().id,
      title,
      this.chapter().outline,
      this.chapter().scenes
    );
    if (title !== this.chapter().title) {
      this.updateChapter.emit(newChapter);
    }
  }

  async updateOutline(outline: string): Promise<void> {
    const newChapter = new NovelChapterViewModel(
      this.chapter().id,
      this.chapter().title,
      outline,
      this.chapter().scenes
    );
    if (outline !== this.chapter().outline) {
      this.updateChapter.emit(newChapter);
    }
  }
}
