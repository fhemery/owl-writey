import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { NovelChaptersViewModel, NovelViewModel } from '../../../model';
import { NovelOverviewChapterCardComponent } from '../novel-overview-chapter-card/novel-overview-chapter-card.component';

@Component({
  selector: 'owl-novel-overview-chapters',
  imports: [
    CommonModule,
    NovelOverviewChapterCardComponent,
    MatIcon,
    TranslateModule,
  ],
  templateUrl: './novel-overview-chapters.component.html',
  styleUrl: './novel-overview-chapters.component.scss',
})
export class NovelOverviewChaptersComponent {
  novel = input.required<NovelViewModel>();
  addAt = output<number>();
  editChapter = output<NovelChaptersViewModel>();

  addChapterAt(index: number): void {
    this.addAt.emit(index);
  }

  updateChapter($event: NovelChaptersViewModel): void {
    this.editChapter.emit($event);
  }
}
