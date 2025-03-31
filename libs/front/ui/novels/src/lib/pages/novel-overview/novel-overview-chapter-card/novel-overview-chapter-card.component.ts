import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { NovelChaptersViewModel } from '../../../model';

@Component({
  selector: 'owl-novel-overview-chapter-card',
  imports: [CommonModule],
  templateUrl: './novel-overview-chapter-card.component.html',
  styleUrl: './novel-overview-chapter-card.component.scss',
})
export class NovelOverviewChapterCardComponent {
  chapter = input.required<NovelChaptersViewModel>();
  updateChapter = output<NovelChaptersViewModel>();

  updateTitle($event: Event): void {
    const title = this.getValue($event);
    if (title !== this.chapter().title) {
      this.updateChapter.emit({
        ...this.chapter(),
        title,
      });
    }
    ($event.target as HTMLInputElement).scrollLeft = 0;
  }

  updateOutline($event: Event): void {
    const outline = this.getValue($event);
    if (outline !== this.chapter().outline) {
      this.updateChapter.emit({
        ...this.chapter(),
        outline,
      });
    }
    ($event.target as HTMLInputElement).scrollLeft = 0;
    ($event.target as HTMLInputElement).scrollTop = 0;
  }

  private getValue($event: Event): string {
    return (($event as InputEvent).target as HTMLInputElement).innerHTML;
  }
}
